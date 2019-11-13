const Rental=require('./models/rental');
const User=require('./models/user');
const fakeDbdata=require('./data.json');
const Booking=require('./models/booking');

class FakeDb{
    constructor(){
        this.rentals = fakeDbdata.rentals;
        this.user=fakeDbdata.users;
    }


    async cleanDb(){
        await User.remove({});
        await Rental.remove({});
        await Booking.remove({})
    }
    pushToDb(){
        const user=new User(this.user[0]);
        const user2=new User(this.user[1]);

        this.rentals.forEach((rental)=> {
            const newRental=new Rental(rental);

            newRental.user=user;
            user.rentals.push(newRental);
            newRental.save();
        });

        user.save();
        user2.save();
    }

    async seedDb(){
        await this.cleanDb();
        this.pushToDb();
    }
}

module.exports=FakeDb;