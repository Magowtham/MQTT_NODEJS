const RechargeHistorySchema=require("./Model/recharge_model");
const currentDate = require("./current_date");
async function rechargeUser(userId,rfid,amount,db,balance){
    if(amount==="?"){
        return {bl:balance};
    }
    const {date,time}=currentDate();
    const newHistory=new RechargeHistorySchema({
        userId,
        date,
        time,
        amount
    })
    await newHistory.save();
   const updateResult= await db.collection("users").updateOne({rfid},{
        $set:{balance:Number(balance)+Number(amount)}
    })
    console.log(updateResult);
    return true;
}

module.exports=rechargeUser;