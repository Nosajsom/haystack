import React from "react";
import ReactDOM from 'react-dom';
import elasticsearch, {Client} from 'elasticsearch';

var client = new elasticsearch.Client({
    host: 'localhost:9200', log: 'trace', apiVersion: '7.2', // use the same version of your Elasticsearch instance
});

const Test = ({response}) => {

    return (
        <>
            <div>Folder Root Test</div>
            {response.hits.hits.map(e=>{
                return (<div>
                    <br/>
                    {e._source.name}
                    <br/>
                    {e._source.text}
                </div>)
            })}
        </>
    );
}

const getServerSideProps = async (context)=> {
    const response = await client.search({
        index: 'document',
        body: {
            query: {
                match: {
                    text: 'AI'
                }
            }
        }
    });
    return {
      props: {response}, // will be passed to the page component as props
    };
  }

export default Test
export {getServerSideProps}
