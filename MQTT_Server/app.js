const aedes = require("aedes")();
const server = require("net").createServer(aedes.handle);
const mongoose = require("mongoose");
const ExpenseModel = require("./Model/expense_model");
const currentDate = require("./current_date");
const rechargeUser=require("./recharge_user");
const addNewUser=require("./add_new_user");

const port = 1883;
aedes.authenticate = function (client, username, password, callback) {
  password = Buffer.from(password, "base64").toString();
  if (username ==="etspp2023" && password ==="Aietspp@3330") {
    return callback(null, true);
  }
  const error = new Error("Authentication Failed!");
  return callback(error, false);
};
server.listen(port, function () {
  console.log(`MQTT server listening on port ${port}`);
});

mongoose.connect(
  "mongodb+srv://chirrp:chirrp@cluster1.wlyepas.mongodb.net/Telephone-Management-System?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    writeConcern: { w: "majority" },
  } 
);
mongoose.connection
  .once("open", function () {
    console.log("connected to database");
    const db = mongoose.connection.db;
    function isJson(str) {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    }
    aedes.on("publish", async function (packate, client) {
      try {
        let topic = packate.topic;
        const payload = packate?.payload?.toString();
        const data = isJson(payload);
        if (data && data.rid) { 
          topic = topic.slice(0, -1) + "S";
          const [isUserExists] = await db
            .collection("users")
            .find({ rfid: data.rid }, { projection: { _id: 1, balance: 1 } })
            .toArray();
            if(data.nm){
              if(isUserExists){
                aedes.publish({topic,payload:JSON.stringify({st:"ap"})});
                return;
              }
              await addNewUser(data.rid,data.nm,data.rn,data.bal);
              aedes.publish({topic,payload:JSON.stringify({st:"ok"})})
              return;
            }
          
          if (!isUserExists) {
            aedes.publish({
              topic,
              payload: JSON.stringify({ bl: -1 }),
            });
            return;
          }
          if(data.st===3)
          {
            const [isUserExists]=await db.collection("users").find({rfid:data.rid},{projection:{_id:1,balance:1}});
            if(!isUserExists)
            {
              aedes.publish({topic,payload:JSON.stringify({bal:-1})});
              return;
            }
            aedes.publish({topic,payload:JSON.stringify({bal:isUserExists.balance})})
            return;
          }
          if(data.amt){
            const result=await rechargeUser(isUserExists._id.toString(),data.rid,data.amt,db,isUserExists.balance);
            if(typeof result==="object"){
              aedes.publish({topic,payload:JSON.stringify(result)});
              return;
            }else{
              aedes.publish({topic,payload:JSON.stringify({st:"ok"})})
              return;
            }
          }  
            if (Number(data.st)) {
              const { date, time } = currentDate();
              const ExpenseHistory = new ExpenseModel({
                userId: isUserExists._id.toString(),
                date,
                callStartTime: time,
                callEndTime: "pending",
                reductedAmount: "pending",
              });
              await ExpenseHistory.save();
              aedes.publish({
                topic,
                payload: JSON.stringify({ bl: isUserExists.balance }),
              });
            } else {
              const { time } = currentDate();
              const [latestDocument]=await db.collection("expenses").find({userId: isUserExists._id.toString()}).sort({date:-1}).limit(1).toArray();
              await db.collection("expenses").updateOne(
                {
                  $and: [
                    {_id:latestDocument._id},
                    { reductedAmount: "pending" },
                  ],
                },
                {  $set: {
                  callEndTime: time,
                  reductedAmount:
                   (Number(data.TM)>0)?Number(isUserExists.balance) - Number(data.bl):0,
                },
              }
            );
            if(Number(data.TM)>0){
              await db.collection("users").updateOne(
                { rfid: data.rid },
                {
                  $set: {
                    balance: Number(data.bl),
                  },
                }
              );
            }
            aedes.publish({
              topic,
              payload: JSON.stringify({ st: "ok" }),
            });
          }
        }
    } catch (error) {
      console.log(error.message);
    }
  });
})
.on("error", (error) => {
  console.log(error.message);
});
