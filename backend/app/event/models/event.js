const mongoose = require('mongoose');
const Calendar=require('../../Calendar/model/calendar')


const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    categories: {
        type: String
      },
      coverImage: {
        type: String,
    
      },
    maxParticipants: {
        type: Number,
        default: 0
    },
    registrations: [{
        user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        
        },
        registrationDate:{
         type: Date,
         default: Date.now,
         required:true
        }
     }]
 }, { timestamps: true });
 
 eventSchema.pre('findOneAndDelete', async function(next) {
  const event = await this.model.findOne(this.getQuery());
  if (event) {
    await Calendar.deleteOne({ title: event.title});
  }
  next();
  });

module.exports = mongoose.model('Event', eventSchema);