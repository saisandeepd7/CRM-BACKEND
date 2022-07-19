import mongodb from "mongodb";

export async function insertUser(client, user) {
    const result = await client.db("crm").collection("user").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function getUser(client, filter) {
    const result = await client.db("crm").collection("user").findOne(filter);
    console.log("successfully matched", result);
    return result;
}

export async function updateUser(client, _id,password) {
    const result = await client.db("crm").collection("user").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:{password:password}});
    console.log("successfully new password updated", result);
    return result;
}

export async function updateActiveStatus(client,email_id,updateStatus) {
    const result = await client.db("crm").collection("user").updateOne({ email_id:email_id },{$set:{Account_Active:updateStatus}});
    console.log("successfully new password updated", result);
    return result;
}

export async function inserttokens(client, user) {
    const result = await client.db("crm").collection("tokens_a").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettokens(client, filter) {
    const result = await client.db("crm").collection("tokens_a").findOne(filter);
    console.log("successfully matched", result);
    return result;
}


export async function deletetokens(client,token){
    const results= await client.db("crm").collection("tokens_a").deleteOne(token);
    console.log("successfully token is deleted",results);
    return results;
}

export async function inserttoken(client, user) {
    const result = await client.db("crm").collection("tokens").insertOne(user);
    console.log("successfully pass inserted", result);
    return result;
}

export async function gettoken(client, filter) {
    const result = await client.db("crm").collection("tokens").findOne(filter);
    console.log("successfully matched", result);
    return result;
}


export async function deletetoken(client,tokenid){
    const results= await client.db("crm").collection("tokens").deleteOne({tokenid:new mongodb.ObjectId(tokenid)});
    console.log("successfully token is deleted",results);
    return results;
}


export async function AddUser(client,user){
    const result = await client.db("crm").collection("usertype").insertOne(user);
    console.log("successfully user is inserted",result);
    return result;
}
export async function FindUser(client,user){
    const result = await client.db("crm").collection("usertype").findOne(user);
    console.log("successfully user found",result);
    return result;
}
export async function FindAllUser(client,user){
    const result = await client.db("crm").collection("usertype").find(user).toArray();;
    console.log("successfully user found",result);
    return result;
}

// lead
export async function putLead(client,lead){
    const result = await client.db("crm").collection("leads").insertOne(lead);
    console.log("successfully lead is inserted",result);
    return result;
}

export async function getLeadData(client,filter){
    const lead = await client.db("crm").collection("leads").find(filter).toArray();
    console.log("successfully all leads obtained", lead);
    return lead;
}

export async function getOneLeadData(client,_id){
    const onelead = await client.db("crm").collection("leads").findOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully all leads obtained", onelead);
    return onelead;
}

export async function updateLeaddata(client, _id,newLead) {
    const result = await client.db("crm").collection("leads").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:newLead});
    console.log("successfully updated", result);
    return result;
}

export async function deleteLeadData(client,_id){
    const deletelead= await client.db("crm").collection("leads").deleteOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully lead is deleted",deletelead);
    return deletelead;
}
export async function countMyLead(client, filter) {
    const results = await client.db("crm").collection("leads").aggregate(filter).toArray();
    console.log("successfully all data got count",results);
    return results;
}

//contact


export async function putContact(client,contact){
    const result = await client.db("crm").collection("contacts").insertOne(contact);
    console.log("successfully contact is inserted",result);
    return result;
}

export async function getContactData(client,filter){
    const contact = await client.db("crm").collection("contacts").find(filter).toArray();
    console.log("successfully all contact obtained", contact);
    return contact;
}

export async function getOneContactData(client,_id){
    const onecontact = await client.db("crm").collection("contacts").findOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully all contact obtained", onecontact);
    return onecontact;
}

export async function updateContactdata(client, _id,newContact) {
    const result = await client.db("crm").collection("contacts").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:newContact});
    console.log("successfully updated", result);
    return result;
}

export async function deleteContactData(client,_id){
    const deletecontact= await client.db("crm").collection("contacts").deleteOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully contact is deleted",deletecontact);
    return deletecontact;
}

export async function countMyContact(client, filter) {
    const results = await client.db("crm").collection("contacts").aggregate(filter).toArray();
    console.log("successfully all data got count",results);
    return results;
}

//service request

export async function putService(client,service){













    const result = await client.db("crm").collection("service_request").insertOne(service);
    console.log("successfully service is inserted",result);
    return result;
}

export async function getServiceData(client,filter){
    const service = await client.db("crm").collection("service_request").find(filter).toArray();
    console.log("successfully all service obtained", service);
    return service;
}

export async function getOneServiceData(client,_id){
    const oneservice = await client.db("crm").collection("service_request").findOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully all service obtained", oneservice);
    return oneservice;
}

export async function updateServicedata(client, _id,newService) {
    const result = await client.db("crm").collection("service_request").updateOne({ _id:new mongodb.ObjectId(_id) },{$set:newService});
    console.log("successfully updated", result);
    return result;
}

export async function deleteServiceData(client,_id){
    const deleteservice= await client.db("crm").collection("service_request").deleteOne({_id:new mongodb.ObjectId(_id)});
    console.log("successfully service is deleted",deleteservice);
    return deleteservice;
}

export async function countMyService(client, filter) {
    const results = await client.db("crm").collection("service_request").aggregate(filter).toArray();
    console.log("successfully all data got count",results);
    return results;
}