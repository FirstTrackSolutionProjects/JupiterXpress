
const ContactForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = (document.querySelector('input[name="email"]')).value;
    const name = (document.querySelector('input[name="name"]')).value;
    const message = (document.querySelector('textarea[name="message"]')).value;
    const subject = (document.querySelector('input[name="subject"]')).value;
    const mobile = (document.querySelector('input[name="mobile"]')).value;

    const data = {
      name : name,
      email : email,
      message : message,
      mobile : mobile,
      subject : subject,
    };

    // Make the API call
    fetch('/.netlify/functions/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          alert("Email sent successfully");
          // Handle successful login
        } else {
          alert('Email failed: ' + result.message);
          // Handle login failure
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred during Email'+data.email +data.message +data.name);
      });
    }
  return (
    <div className="flex flex-col w-full lg:w-auto space-y-6 items-center text-black my-12 font-medium">
      <form action="" onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full sm:w-[500px]">
        <input type="text" name="name" placeholder="Full Name" className="py-2 px-4 rounded-3xl" />
        <input type="email" name="email" placeholder="E-mail Address" className="py-2 px-4 rounded-3xl"/>
        <input type="text" name="mobile" placeholder="Mobile Number" className="py-2 px-4 rounded-3xl"/>
        <input type="subject" name="subject" placeholder="Subject" className="py-2 px-4 rounded-3xl"/>
        <textarea name="message" placeholder="Message" className="py-2 px-4 h-32 rounded-3xl"/>
        <button type="submit" className="px-4 py-2 border border-white text-white rounded-3xl">Send</button>
      </form>
    </div>
  )
}

export default ContactForm
