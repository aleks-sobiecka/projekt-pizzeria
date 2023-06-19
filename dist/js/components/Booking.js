import {templates, select} from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
    constructor(element){
        const thisBooking = this;

        thisBooking.render(element);
        thisBooking.initWidgets();
    }
    render(element){
        const thisBooking = this;

        thisBooking.dom = {};
        thisBooking.dom.wrapper = element;

        const generatedHTML = templates.bookingWidget();
        const generatedDOM = utils.createDOMFromHTML(generatedHTML);
        thisBooking.dom.wrapper.appendChild(generatedDOM);

        thisBooking.dom.peopleAmount = element.querySelector(select.booking.peopleAmount);
        thisBooking.dom.hoursAmount = element.querySelector(select.booking.hoursAmount);
        thisBooking.dom.datePicker = element.querySelector(select.widgets.datePicker.wrapper);
        thisBooking.dom.hourPicker = element.querySelector(select.widgets.hourPicker.wrapper);
    }
    initWidgets(){
        const thisBooking = this;

        thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
        thisBooking.dom.peopleAmount.addEventListener('updated', function(){})
        
        thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
        thisBooking.dom.hoursAmount.addEventListener('updated', function(){})

        thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
        thisBooking.dom.datePicker.addEventListener('update', function(){});

        thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
        thisBooking.dom.hourPicker.addEventListener('update', function(){});
    }
}

export default Booking;