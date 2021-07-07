const Agenda = require('agenda');
const connectionOpts = {db: {address: process.env.MONGO_DB_URL, collection: 'agendaJobs'}};
const agenda = new Agenda(connectionOpts);
const mongoose = require("mongoose");
const env = process.env
const moment = require("moment");
const Trip = require('../node/models/trip_details');
const Firebase = require('../node/config/firebase');
const User = require('../node/models/user');

const RequestDetail = require('../node/models/request_details');

agenda.define('requestProcess',{lockLifetime: 10000}, async(job, done) => {
    job.repeatEvery('10 seconds', {
        skipImmediate: true
    });
    job.save();
    var trip_id = job.attrs.data.trip_detail._id;
    console.log(trip_id)
    var trip_detail = await Trip.findOne({'_id': trip_id})
    console.log(trip_detail._id);
    
    if(trip_detail.trip_status=='processing')
    {
        var order_requests = await RequestDetail.find({'trip_id':trip_detail._id, is_deleted: false });
        console.log(order_requests.length);
        console.log(order_requests[0]._id);
        if(order_requests.length)
        {
            var delivery = order_requests[0].user_id;
            var order_requests_current_driver = await RequestDetail.find({'user_id':order_requests[0].user_id, is_deleted: false }).distinct('_id');
            for(let j=0;j<order_requests_current_driver.length;++j)
            {
                await RequestDetail.findOneAndUpdate({ "driver_id": order_requests_current_driver[j] }, { "$set": { request_status:'Requesting' }}).exec(async(err,res)=>{
                console.log("update requesting to current one ");
                });
            }
            //await Trip.findOneAndUpdate({ "_id": trip_detail._id }, { "$set": { last_delivery_id: order_requests[0].delivery_id._id, last_delivery_time: moment().toISOString()}}).exec();
            var trip_detail = await Trip.findOne({'_id':trip_detail._id});
            var response_time={
                start:0,
                end:10,
                duration:10,
                angle:0,
                status:true
            }
            //global.io.in("user_"+ order_requests[0].user_id).emit('new_order', {trip_detail,response_time});
            var driver_detail = await User.findOne({'_id':order_requests[0].driver_id});
            if(driver_detail.device_id.length)
            {
                for(let i=0;i<driver_detail.device_id.length;++i)
                {
                    Firebase.singleNotification(driver_detail.device_id[i]);
                    console.log(driver_detail.device_id[i]);
                }
            }
            console.log("requested "+ delivery +' for order '+ order_requests[0].driver_id +' at '+ moment().format('HH:mm:ss'));
            await RequestDetail.findOneAndUpdate({ '_id': order_requests[0]._id }, { "$set": { is_deleted: true }}).exec();
            // RequestDetail.findOne({ '_id': order_requests[0]._id, 'request_status': 'Cancelled' }, async (err, old_requests) =>{
            //     await old_requests.remove()
            // });
        }
        else
        {
            console.log("not accept")
            await RequestDetail.deleteMany({'trip_id':trip_detail._id, 'request_status': 'Cancelled' },function(){});
            //await Trip.findOneAndUpdate({ "_id": trip_detail._id }, { "$set": {request_status:'pending',last_delivery_id:'',last_delivery_time:''}}).exec();
            var trip_detail = await Trip.findOne({'_id':trip_detail._id});
            var new_result={}
            new_result.message = "not_available"
            //global.io.in("user_"+trip_detail.user_id).emit('not_accept', {trip_detail,new_result});
            job.remove(err => {});
        }
    }
    else
    {
        console.log("In else Part");
        await RequestDetail.deleteMany({'trip_id':trip_id},function(){});
        job.remove(err => {});
    }
    done();
});
module.exports = agenda;