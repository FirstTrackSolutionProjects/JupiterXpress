
import Header from "../Components/Header"
import Footer from "../Components/Footer"
import ServiceCard from "../Components/ServiceCard"
import ReasonCard from "../Components/ReasonCard"


const About = () => {
  return (
    <>
    <Header />
    
    <div className={`relative space-y-10 min-h-screen px-6 md:px-12 py-32 z-0 bg-center  bg-no-repeat bg-fixed bg-heroBg bg-cover flex flex-col justify-center items-center overflow-auto`}>
    <div className="absolute z-10 h-full w-full bg-[rgba(146,169,228,0.59)]">

    </div>
     <div className="w-full relative z-20 space-y-5 max-w-[1024px] border p-4 rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Who we are?</div>
            <div>
                Jupiter Xpress Delivery is a leading provider of efficient and reliable delivery services since 1st Mar 2022 and committed to simplifying logistics for businesses and individuals. Our mission is to ensure swift and secure delivery of a wide range of products, including electronics, clothing, documents, perishables, and more. 
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
     <div className="w-full relative z-20 space-y-10 max-w-[1024px] border px-4 py-10 flex flex-col items-center rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Our Services</div>
            <div className="w-full flex flex-wrap justify-center space-y-4 scxl:space-x-4 scxl:space-y-0">
                <div className="flex flex-wrap justify-evenly space-y-4 scsm:space-y-0 scsm:space-x-4 scxl:space-y-0" >
                <ServiceCard color={'bg-purple-600'}/>
                <ServiceCard color={'bg-blue-600'}/>
                </div>
                <div className="flex flex-wrap justify-evenly space-y-4 scsm:space-y-0 scsm:space-x-4 scxl:space-y-0" >
                <ServiceCard color={'bg-green-600'}/>
                <ServiceCard color={'bg-cyan-500'}/>
                </div>
            </div>
     </div>
     <div className="w-full relative z-20 space-y-10 max-w-[1024px] border px-4 py-10 rounded-xl bg-[rgba(255,255,255,0.7)]">
            <div className="font-medium text-2xl text-center">Why Jupiter Xpress</div>
            <div className="space-y-3">
            <div className="w-full flex justify-evenly flex-wrap space-y-3 rcsm:space-y-0 ">
                <ReasonCard color={'bg-purple-600'}/>
                <ReasonCard color={'bg-blue-600'}/>
                <ReasonCard color={'bg-green-600'}/>
            </div>
            <div className="w-full flex justify-evenly flex-wrap space-y-3 rcsm:space-y-0">
                <ReasonCard color={'bg-cyan-500'}/>
                <ReasonCard color={'bg-yellow-500'}/>
                <ReasonCard color={'bg-orange-600'}/>
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
