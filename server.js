// const express=require("express");
// const app=express();
// app.use(cookieParser("secretcode"));
// app.get("/",(req,res)=>{
//     res.send("Hi,I am root");
// });
// app.get("/getcookie",(req,res)=>{
//     res.cookie("greet","hello");
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("greet","hello",{signed:true});
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.cookies);
//     res.send("verified");
// });


// app.use(
//     session({
//         secret:"mysupersecretcode",
//         resave:false,
//         saveUninitialised:true,
//     })
// );

// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you have sent request ${req.session.count} times`);
// });