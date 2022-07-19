import {
    insertUser,
    getUser,
    updateUser,
    inserttoken,
    gettoken,
    deletetoken,
    inserttokens,
    gettokens,
    deletetokens,
    updateActiveStatus,
    putLead,
    getLeadData,
    deleteLeadData,
    getOneLeadData,
    updateLeaddata,
    putContact,
    getContactData,
    deleteContactData,
    getOneContactData,
    updateContactdata,
    putService,
    getServiceData,
    deleteServiceData,
    getOneServiceData,
    updateServicedata,
    AddUser,
    FindUser,
    FindAllUser,
    countMyLead,countMyContact,countMyService
  } from "../helper.js";
  
  import { createConnection } from "../index.js";
  import express from "express";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  
  import { auth } from "../middleware/auth.js";
  import { sendEmail } from "../middleware/mail.js";
  
  const router = express.Router();
  
  router.route("/signup").post(async (request, response) => {
    const { email_id, firstname, lastname, password } = request.body;
    const client = await createConnection();
    const find=await FindUser(client,{email_id});
    if (find){
        const type=find.type;
    const myUser = await getUser(client, { email_id: email_id });
    if (!myUser) {
      const hashedPassword = await genPassword(password);
      const isActive = "false";
      const pass = await insertUser(client, {
        email_id,
        firstname,
        lastname,
        password: hashedPassword,
        Account_Active: isActive,
        type
      });
      const token = jwt.sign({ email_id: email_id }, process.env.REKEY);
  
      const store = await inserttokens(client, {
        email_id: email_id,
        token: token,
      });
      const link = `${process.env.BASE_URL}/account-activation/${email_id}/${token}`;
      const mail = await sendEmail(email_id, "Account Activation", link);
      console.log(hashedPassword, pass);
      response.send({
        message: "account activation link is send to your mail id",
      });
    } else {
      response.send({ message: "already same email_id exists" });
    }}
    else{
        response.send({message:"you are not the employee of our company,since your email not matched with our record"})
    }
  });
  
  router
    .route("/activate_account/:email_id/:token")
    .get(async (request, response) => {
      const email_id = request.params.email_id;
      const token = request.params.token;
      const client = await createConnection();
      const mytokens = await gettokens(client, { token: token });
      if (!mytokens) {
        response.send({ message: "invalid token" });
      } else {
        const updateStatus = "true";
        const updateuserActiveStatus = await updateActiveStatus(
          client,
          email_id,
          updateStatus
        );
        const deletemytokens = await deletetokens(client, { token: token });
        response.send({ message: "your account got activated" });
      }
    });
  
  router.route("/login").post(async (request, response) => {
    const { email_id, password } = request.body;
    const client = await createConnection();
    
    const user = await getUser(client, { email_id: email_id });
    if (!user) {
      response.send({ message: "user not exist ,please sign up" });
    } else {
      if (user.Account_Active == "true") {
        
        const type=user.type;
        const inDbStoredPassword = user.password;
        const isMatch = await bcrypt.compare(password, inDbStoredPassword);
        if (isMatch) {
          const token = jwt.sign({ id: user._id }, process.env.KEY);
  
          response.send({
            message: "successfully login",
            token: token,
            type:type
          });
        } else {
          response.send({ message: "invalid login" });
        }
      } else {
        response.send({ message: "account not yet Activated" });
      }
    }
  });
  
  router.route("/forgetpassword").post(async (request, response) => {
    const { email_id } = request.body;
    const client = await createConnection();
    const user = await getUser(client, { email_id });
    if (!user) {
      response.send({ message: "user not exist" });
    } else {
      const token = jwt.sign({ id: user._id }, process.env.REKEY);
      const expiryDate = Date.now() + 3600000;
      const store = await inserttoken(client, {
        tokenid: user._id,
        token: token,
        expiryDate: expiryDate,
      });
      const link = `${process.env.BASE_URL}/password-reset/${user._id}/${token}`;
  
      const mail = await sendEmail(user.email_id, "Password reset", link);
      response.send({
        message: "link has been send to your email for password change",
      });
    }
  });
  
  router.route("/resetpassword/:id/:token").post(async (request, response) => {
    const { password } = request.body;
    const id = request.params.id;
    const token = request.params.token;
    const client = await createConnection();
    const tokens = await gettoken(client, { token: token });
    if (!tokens) {
      response.send({ message: "invalid token" });
    } else {
      if (Date.now() < tokens.expiryDate) {
        const hashedPassword = await genPassword(password);
        const updateuserpassword = await updateUser(client, id, hashedPassword);
        const deletetokens = await deletetoken(client, id);
        response.send({ message: "password got updated" });
      } else {
        response.send({ message: "link got expired" });
      }
    }
  });
  
  
  router.route("/adduser").post(async (request, response) => {
      const { email_id,type } = request.body;
      const clients = await createConnection();
      const user = await AddUser(clients, {
        email_id,type
      });
      response.send({message:"user added"});
    });
  
    router.route("/listuser").get(async (request, response) => {
      const clients = await createConnection();
      const user = await FindAllUser(clients, {});
      response.send(user);
    });
  
  //lead
  
  router.route("/lead").post( auth,async (request, response) => {
    const { client, mobile_no, email_id,  status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
    const clients = await createConnection();
    const lead = await putLead(clients, {
      client,
      mobile_no,
      email_id,
      date,
      timestamp,
      status,
    });
    const type="Admin"
    const find=await FindUser(clients,{type:type });
    const id=find.email_id
    const mail=  await sendEmail(id, "New Lead Generated",
      `Lead details
      
      1.client:${client}
      2.mobile_no:${mobile_no}
      3.email_id:${email_id}
      4.date:${date}
      5.status:${status}
     `);
    response.send({message:"lead added successfully and mail sent to admin",type:type});
  });
  
  router.route("/leadtable").get(auth, async (request, response) => {
    const client = await createConnection();
    const lead = await getLeadData(client, {});
    response.send(lead);
  });
  
  router
    .route("/leadtable/:_id")
    .delete(auth, async (request, response) => {
      const _id = request.params._id;
      console.log(_id);
      const client = await createConnection();
      const deletelead = await deleteLeadData(client, _id);
  
      response.send(deletelead);
    })
    .get( auth,async (request, response) => {
      const _id = request.params._id;
      const client = await createConnection();
      const getonelead = await getOneLeadData(client, _id);
      response.send(getonelead);
    })
    .patch(auth, async (request, response) => {
      const _id = request.params._id;
      const { client, mobile_no, email_id,  status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
      const clients = await createConnection();
      const updatelead = await updateLeaddata(clients, _id,{
        client,
        mobile_no,
        email_id,
        date,
        timestamp,
        status,
      } );
      response.send({message:"lead got edited"});
    });
  
    router.route("/countLead").get(async(request,response)=>{
      const client=  await createConnection();
      const counts =  await  countMyLead(client,[
          {
            $project: {
              month: { $month: "$timestamp" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ])
      response.send(counts);
  });
  
  //contact
  
  router.route("/contact").post( auth, async (request, response) => {
    const { client, mobile_no, email_id,status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
    const clients = await createConnection();
    const contact = await putContact(clients, {
      client,
      mobile_no,
      email_id,
      date,
      timestamp,
      status,
    });
    
    const type="Admin"
    const find=await FindUser(clients,{type:type });
    const id=find.email_id
    const mail=  await sendEmail(id, "New Contact Generated",
      `Contact details
      
      1.client:${client}
      2.mobile_no:${mobile_no}
      3.email_id:${email_id}
      4.date:${date}
      5.status:${status}
     `);
    response.send({message:"contact created and mail sent to admin",type:type});
  });
  
  router.route("/contacttable").get( auth,async (request, response) => {
    const client = await createConnection();
    const contact = await getContactData(client, {});
    response.send(contact);
  });
  
  router
    .route("/contacttable/:_id")
    .delete( auth,async (request, response) => {
      const _id = request.params._id;
      console.log(_id);
      const client = await createConnection();
      const deleteContact = await deleteContactData(client, _id);
      response.send(deleteContact);
    })
    .get( auth,async (request, response) => {
      const _id = request.params._id;
      const client = await createConnection();
      const getonelead = await getOneContactData(client, _id);
      response.send(getonelead);
    })
    .patch(auth, async (request, response) => {
      const _id = request.params._id;
      const { client, mobile_no, email_id,status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
      const clients = await createConnection();
      const updatecontact = await updateContactdata(clients, _id, {
        client,
        mobile_no,
        email_id,
        date,
        timestamp,
        status,
      });
      response.send({message:"contact edited"});
    });
  
  
    router.route("/countcontact").get(async(request,response)=>{
      const client=  await createConnection();
      const counts =  await  countMyContact(client,[
          {
            $project: {
              month: { $month: "$timestamp" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ])
      response.send(counts);
  });
  //service request
  
  router.route("/service_request").post( auth,async (request, response) => {
    const { client, problem,status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
    const clients = await createConnection();
    const service = await putService(clients, { client, problem, date,timestamp,status });
    const type="Admin"
    const find=await FindUser(clients,{type:type });
    const id=find.email_id
    const mail=  await sendEmail(id, "New Service Generated",
      `Service Request details
      
      1.client:${client}
      2.problem:${problem}
      4.date:${date}
      5.status:${status}
     `);
    response.send({message:"service request added",type:type});
  });
  
  router.route("/servicetable").get( auth,async (request, response) => {
    const client = await createConnection();
    const service = await getServiceData(client, {});
    response.send(service);
  });
  
  router
    .route("/servicetable/:_id")
    .delete(auth, async (request, response) => {
      const _id = request.params._id;
      const client = await createConnection();
      const deleteservice = await deleteServiceData(client, _id);
      response.send(deleteservice);
    })
    .get(auth,async (request, response) => {
      const _id = request.params._id;
      const client = await createConnection();
      const getoneservice = await getOneServiceData(client, _id);
      response.send(getoneservice);
    })
    .patch( auth,async (request, response) => {
      const _id = request.params._id;
    const { client, problem,status } = request.body;
    const timestamp= new Date();
    const date=timestamp.toLocaleString();
    const clients = await createConnection();
      const updateservice = await updateServicedata(clients, _id,{ client, problem, date,timestamp,status } );
      response.send({message:"service request edited"});
    });
  
    router.route("/countservice").get(async(request,response)=>{
      const client=  await createConnection();
      const counts =  await  countMyService(client,[
          {
            $project: {
              month: { $month: "$timestamp" },
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: 1 },
            },
          },
        ])
      response.send(counts);
  });
  
  async function genPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }
  
  export const userRouter = router;