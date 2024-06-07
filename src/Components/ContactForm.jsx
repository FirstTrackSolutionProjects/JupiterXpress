
const ContactForm = () => {
  return (
    <div className="flex flex-col w-full space-y-6 items-center text-black my-12 font-medium">
      <form action="" className="flex flex-col space-y-2 w-full sm:w-[500px]">
        <input type="text" name="name" placeholder="Full Name" className="py-2 px-4 rounded-3xl" />
        <input type="email" name="email" placeholder="E-mail Address" className="py-2 px-4 rounded-3xl"/>
        <input type="text" name="mobile" placeholder="Mobile Number" className="py-2 px-4 rounded-3xl"/>
        <input type="subject" name="subject" placeholder="Subject" className="py-2 px-4 rounded-3xl"/>
        <textarea name="message" placeholder="Message" className="py-2 px-4 h-32 rounded-3xl"/>
        <button type="submit" className="px-4 py-2 border border-black rounded-3xl">Send</button>
      </form>
    </div>
  )
}

export default ContactForm
