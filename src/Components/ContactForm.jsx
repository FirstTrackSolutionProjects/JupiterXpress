import { useState } from "react";
import emailjs from 'emailjs-com';
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
    const templateParams = {
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      name : formData.name,
      mobile : formData.mobile
    };
    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const userID = import.meta.env.VITE_EMAILJS_USER_ID
    emailjs.send(serviceID, templateID, templateParams, userID)
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        alert('Email sent successfully!');
        setIsSending(false);
      }, (error) => {
        console.error('Failed to send email.', error);
        alert('Error sending email. Please try again.');
        setIsSending(false);
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
