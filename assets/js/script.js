$(document).ready(function () {
    $('#schedule_btn_form').on('click', function (e) {
        e.preventDefault();

        const service = $('#schedule_service').val();
        const address = $('#schedule_address').val().trim();
        const name = $('#schedule_name').val().trim();
        const email = $('#schedule_email').val().trim();
        const phone = $('#schedule_phone').val().trim();
        const messageDiv = $('.schedule_message');

        // Validate required fields
        if (!service || service === "Choose Service*" || !address || !name || !email || !phone) {
            messageDiv.text('Please fill in all the required fields.').css('color', 'red');
            return;
        }

        // Validation for email and phone
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

        if (!emailRegex.test(email)) {
            messageDiv.text('Please enter a valid email address.').css('color', 'red');
            return;
        }

        if (!phoneRegex.test(phone)) {
            messageDiv.text('Please enter a valid phone number.').css('color', 'red');
            return;
        }

        // Send AJAX request
        $.ajax({
            url: './assets/php/submit-form-schedule.php',
            type: 'POST',
            data: {
                service: service,
                address: address,
                name: name,
                email: email,
                phone: phone
            },
            success: function (response) {
                messageDiv.text('Appointment scheduled successfully!').css('color', '#b8ffb8');
                $('#schedule_service').val('Choose Service*');
                $('#schedule_address, #schedule_name, #schedule_email, #schedule_phone').val('');
            },
            error: function () {
                messageDiv.text('An error occurred. Please try again later.').css('color', 'red');
            }
        });
    });
});




$(document).ready(function () {
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        console.log("form submit");

        const name = $('#name').val().trim();
        const address = $('#address').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const message = $('#message').val().trim();
        const messageDiv = $('.showMessage');

        // Get selected services
        const selectedServices = [];
        $('input[name="services[]"]:checked').each(function () {
            selectedServices.push($(this).val());
        });

        // Basic validation
        if (!name || !address || !email || !phone || !message || selectedServices.length === 0) {
            messageDiv.text('Please fill in all fields').css('color', 'red');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

        if (!emailRegex.test(email)) {
            messageDiv.text('Please enter a valid email address.').css('color', 'red');
            return;
        }

        if (!phoneRegex.test(phone)) {
            messageDiv.text('Please enter a valid phone number.').css('color', 'red');
            return;
        }

        $.ajax({
            url: './assets/php/submit-form-contact.php',
            type: 'POST',
            data: {
                name: name,
                address: address,
                email: email,
                phone: phone,
                message: message,
                services: selectedServices // Sends as array
            },
            dataType: 'json',
            success: function (response) {
                console.log(response);
                if (response.status === 'success') {
                    messageDiv.text(response.message).css('color', 'green');
                    $('#contact-form')[0].reset();
                } else {
                    messageDiv.text(response.message).css('color', 'red');
                }
            },
            error: function (xhr) {
                messageDiv.text('Something went wrong. Please try again later.').css('color', 'red');
            }
        });
    });
});
