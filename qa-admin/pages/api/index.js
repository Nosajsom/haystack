import {__API__ as API} from '../../api'

export default async function handler(req, res) {
    try{
        const {
            func,
            args
        } = req.body
        if(API[func]!==undefined && typeof API[func]==='function'){
            console.log('Calling '+func)
            const responseData = await API[func](...args)
            res.status(200).json(responseData)
        }
        else{
            res.status(500).json({error:'Function not found'})
        }
        return
    } catch(e){
        console.error(e)
        res.status(500).json({error:e})
    }
}

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '100mb',
      },
    },
}