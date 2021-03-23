require('dotenv').config();
const express=require('express');
const { restart } = require('nodemon');
const jwt = require('jsonwebtoken')
const app=express();

app.use(express.json());

const posts=[
    {
    username:'Kyle',
    title:'Post1'
},
    {
    username:'Jim',
    title:'Post2'
},
    {
    username:'Kim',
    title:'Post3'
},
]

// app.get('/posts',authenticateToken,(req,res)=>{
// res.json(posts.filter(post=>post.username===req.user.name))
// })

let refreshTokens = [];

app.post('/token',(req,res)=>{
    const refreshToken = req.body.token
    console.log(refreshToken);
    if(refreshToken==null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        const accessToken=generateAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
})

app.delete('/logout',(req,res)=>{
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
})

app.post('/login',(req,res)=>{
    //
    const username=req.body.username;
    const user={name:username};
    const accessToken = generateAccessToken(user);
    const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    console.log(refreshTokens);
    res.json({accessToken:accessToken,refreshToken:refreshToken});
    
})

function generateAccessToken(user) {
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'15s'});
}

app.listen(4000)