import 'dotenv/config';
import fetch from 'node-fetch';

const getOpenAIAPIResponse = async(message)=>{
    const options = {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            // model:"gpt-5-nano", 
             model:"gpt-4o-mini",
            messages:[{
                role: "user",
                content: message
            }]
        })
    };

    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions',options);
        const data = await response.json();
        return (data.choices[0].message.content);   //reply
        // res.send(data.choices[0].message.content)
    }catch(err){
        console.log(err);
    }
}


export default getOpenAIAPIResponse