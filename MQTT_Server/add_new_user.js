const UserSchema=require("./Model/new_user");
async function addNewUser(rfid,name,rollNumber,balance){
    const newUser=new UserSchema({
        rfid,
        name,
        rollNumber,
        balance
    })
    await newUser.save();
}

module.exports=addNewUser;