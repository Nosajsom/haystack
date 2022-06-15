import json
import logging
import os
import shutil
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional, List
from urllib.parse import unquote
import requests
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request, Cookie

from haystack import Pipeline
from rest_api.config import PIPELINE_YAML_PATH, FILE_UPLOAD_PATH, INDEXING_PIPELINE_NAME
from elasticsearch import Elasticsearch
import sqlite3

PIPELINE = Pipeline()
retriever = PIPELINE.get_node(name="ESRetriever")
document_store = retriever.document_store if retriever else None
logger = logging.getLogger(__name__)
router = APIRouter()

try:
    INDEXING_PIPELINE = Pipeline.load_from_yaml(Path(PIPELINE_YAML_PATH), pipeline_name=INDEXING_PIPELINE_NAME)
except KeyError:
    INDEXING_PIPELINE = None
    logger.info("Indexing Pipeline not found in the YAML configuration. File Upload API will not be available.")


os.makedirs(FILE_UPLOAD_PATH, exist_ok=True)  # create directory for uploading files


@router.post("/file-upload")
def file_upload(
    request: Request,
    file: UploadFile = File(...),
    table_email: Optional[str] = Form(None),
    meta: Optional[str] = Form("null"),  # JSON serialized string
    remove_numeric_tables: Optional[bool] = Form(None),
    remove_whitespace: Optional[bool] = Form(None),
    remove_empty_lines: Optional[bool] = Form(None),
    remove_header_footer: Optional[bool] = Form(None),
    valid_languages: Optional[List[str]] = Form(None),
    split_by: Optional[str] = Form(None),
    split_length: Optional[int] = Form(None),
    split_overlap: Optional[int] = Form(None),
    split_respect_sentence_boundary: Optional[bool] = Form(None),
    user: Optional[str] = Cookie(None)
):
    logging.info("ENTERED FILE_UPLOAD")
    if not INDEXING_PIPELINE:
        raise HTTPException(status_code=501, detail="Indexing Pipeline is not configured.")
    # try:
        # raise Exception("Problem")

    if file.filename.rfind("/") != -1:
        file.filename = file.filename[file.filename.rfind("/")+1:] # Remove leading directory names, if exists TODO: This may cause issues in mac systems, as mac supports slashes in file names

    file_path = Path(FILE_UPLOAD_PATH) / f"{uuid.uuid4().hex}_{file.filename}"
    logging.info(f"path123 {file_path}")
    logging.info(f"basename {file.filename}")
    logging.info(f"meta123 {meta}")
    meta = json.loads(meta) or {}

    meta["clientIdentity"] = unquote(user)
    logging.info(f"table_email {table_email}")
    if table_email:
        meta["clientIdentity"] = unquote(table_email)
        

    
    # We can also close the connection if we are done with it.
    # Just be sure any changes have been committed or they will be lost.

    
    
    file_name = file.filename
    if "name" in meta.keys():
        # Means this is an image file, please refer to Qianxi's extension, background.js file.
        #logging.info(f"This is an image")
        file_name = meta["name"]
        
        if file_name.rfind("/") != -1:
            file_name = file_name[file_name.rfind("/")+1:] # Remove leading directory names, if exists TODO: This may cause issues in mac systems, as mac supports slashes in file names
        
        
        file_path = Path(FILE_UPLOAD_PATH) / f"{uuid.uuid4().hex}_{file_name}"
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        path_str = str(file_path)
        #logging.info(f'File path {path_str}')

        meta["file_path"] = path_str
    else:
        # Not an image file.
        meta["name"] = file.filename
        #res = document_store.query(index="document",query='{"bool":{"must":{"match":{"name":'+file.filename+'}}}')
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        meta["file_path"] = str(file_path)

    meta["added_time"] = str(datetime.now())
    logger.info(f'Converting {file_name} ...')
    logging.info(f'File path {file_path}')
    # INDEXING_PIPELINE.run(
    #     file_paths=[file_path],
    #     remove_numeric_tables=remove_numeric_tables,
    #     remove_whitespace=remove_whitespace,
    #     remove_empty_lines=remove_empty_lines,
    #     remove_header_footer=remove_header_footer,
    #     valid_languages=valid_languages,
    #     split_by=split_by,
    #     split_length=split_length,
    #     split_overlap=split_overlap,
    #     split_respect_sentence_boundary=split_respect_sentence_boundary,
    #     meta=meta,
    #     content_type=request.headers.get('content-type')
    # )
    INDEXING_PIPELINE.run(
        file_paths=[file_path],
        meta=meta
        # params = {
        # remove_numeric_tables: remove_numeric_tables,
        # remove_whitespace: remove_whitespace,
        # remove_empty_lines: remove_empty_lines,
        # remove_header_footer: remove_header_footer,
        # valid_languages: valid_languages,
        # split_by: split_by,
        # split_length: split_length,
        # split_overlap: split_overlap,
        # split_respect_sentence_boundary: split_respect_sentence_boundary,
        # content_type: request.headers.get('content-type')
        # }
    )
    logger.info(f'Finished converting {file_name}')
# except Exception as e:
#     logger.info(e)
# finally:
    file.file.close()
    logger.info(f"filename3 {file_name}")
    res = requests.post(url="http://localhost:8000/incremental_acronym/"+file_name, 
                headers={"Content-Type": "multipart/form-data"},cookies={"user": meta["clientIdentity"]} 
        
                )
    logger.info(f"res {res}")
