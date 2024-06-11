import { useState } from "react";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    message: '',
    subject: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      "name" : formData.name,
      "email" : formData.email,
      "message" : formData.message,
      "mobile" :formData.mobile,
      "subject" :formData.subject
    };

    // Make the API call
    fetch("/.netlify/functions/contact", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(data),
    })
      .then(response => alert(response))
      // .then(result => {
      //   alert(result.message);
        // if (result.success) {
        //   alert("Email sent successfully");
        //   // Handle successful login
        // } else {
        //   alert('Email failed: ' + result.message);
        //   // Handle login failure
        // }
      // })
      .catch(error => {
        // console.error("Error:", error);
        alert("An error occurred during Email" + error);
      });
    }
  return (
    <div className="flex flex-col w-full lg:w-auto space-y-6 items-center text-black my-12 font-medium">
      <form action="" onSubmit={handleSubmit} className="flex flex-col space-y-2 w-full sm:w-[500px]">
        <input type="text" value={formData.name}  onChange={handleChange} name="name" placeholder="Full Name" className="py-2 px-4 rounded-3xl" />
        <input type="email" value={formData.email} onChange={handleChange} name="email" placeholder="E-mail Address" className="py-2 px-4 rounded-3xl"/>
        <input type="text" value={formData.mobile} onChange={handleChange} name="mobile" placeholder="Mobile Number" className="py-2 px-4 rounded-3xl"/>
        <input type="subject" value={formData.subject} onChange={handleChange} name="subject" placeholder="Subject" className="py-2 px-4 rounded-3xl"/>
        <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" className="py-2 px-4 h-32 rounded-3xl"/>
        <button type="submit" className="px-4 py-2 border border-white text-white rounded-3xl">Send</button>
      </form>
    </div>
  )
}

export default ContactForm
