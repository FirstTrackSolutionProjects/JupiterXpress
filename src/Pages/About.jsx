
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import ServiceCard from "../Components/ServiceCard"
import ReasonCard from "../Components/ReasonCard"

const About = () => {
  return (
    <>
    <Header />
    
    <div className='relative space-y-10 min-h-screen px-6 md:px-12 py-32 z-[-1] bg-center  bg-no-repeat bg-fixed bg-[url("contactbg.jpg")] bg-cover flex flex-col justify-center items-center overflow-auto'>
    <div className="absolute z-0 h-full w-full bg-[rgba(0,0,255,0.1)]">

    </div>
     <div className="w-full z-10 space-y-5 max-w-[1024px] border p-4 rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Who we are?</div>
            <div>
                Jupiter Xpress Delivery is a leading provider of efficient and reliable delivery services, committed to simplifying logistics for businesses and individuals. Our mission is to ensure swift and secure delivery of a wide range of products, including electronics, clothing, documents, perishables, and more. 
            </div>
            <div>
                With a focus on customer satisfaction, we offer flexible delivery options such as same-day delivery, standard shipping, and international shipping, tailored to meet diverse needs. Our advanced tracking systems enable real-time monitoring of shipments, providing transparency and peace of mind to our clients.
            </div>
            <div>
                At Jupiter Xpress Delivery, we prioritize reliability, speed, and affordability. Our dedicated team of logistics experts works tirelessly to ensure timely deliveries and exceptional service quality. Whether you are a small business or a large enterprise, we strive to be your trusted logistics partner, facilitating seamless product distribution and enhancing your customer experience.
            </div>
            <div>
                Experience convenience and efficiency with Jupiter Xpress Delivery - your reliable partner in logistics solutions.
            </div>
     </div>
     <div className="w-full z-10 space-y-10 max-w-[1024px] border px-4 py-10 rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Our Services</div>
            <div className="w-full flex justify-evenly">
                <ServiceCard color={'blue-600'}/>
                <ServiceCard color={'blue-600'}/>
                <ServiceCard color={'blue-600'}/>
                <ServiceCard color={'blue-600'}/>
            </div>
     </div>
     <div className="w-full z-10 space-y-10 max-w-[1024px] border px-4 py-10 rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Why Jupiter Xpress</div>
            <div className="space-y-3">
            <div className="w-full flex justify-evenly">
                <ReasonCard/>
                <ReasonCard/>
                <ReasonCard/>
            </div>
            <div className="w-full flex justify-evenly">
                <ReasonCard/>
                <ReasonCard/>
                <ReasonCard/>
            </div>
            </div>
     </div>
     {/* <Carousel images={['logo.webp', 'ContactBg.jpg']} /> */}
      
    </div>
    <Footer/>
    </>
  )
}

export default About
