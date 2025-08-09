import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
const API_URL = import.meta.env.VITE_APP_API_URL
const Form = () => {
    const [formData, setFormData] = useState({
        awb: ''
    })
    const [loading, setLoading] = useState(false)
    const [autoSubmit, setAutoSubmit] = useState(false)

    useEffect(() => {
        if (localStorage.getItem('track')) {
            const awbValue = localStorage.getItem('track');
            setFormData({ awb: awbValue });
            localStorage.setItem('track', '');
            setAutoSubmit(true);
        }
    }, [])

    useEffect(() => {
        if (autoSubmit && formData.awb) {
            handleSubmit();
            setAutoSubmit(false);
        }
    }, [formData.awb, autoSubmit])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'radio' ? checked : value
        }));
    };
    const [trackingData, setTrackingData] = useState(null)
    const handleSubmit = async (e) => {
        try {
            e?.preventDefault();
            setLoading(true)
            const data = await fetch(`${API_URL}/shipment/track`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            }).then(response => response.json())
            if (!data?.success || !data?.data || !data?.data?.length){
                toast.error('Tracking data for AWB is not available')
                return
            }
            toast.success('Parcel tracking successful')
            setTrackingData(data)
            setLoading(false)
        } catch (e) {
            console.error(e)
            toast.error('Failed to track parcel')
        } finally {
            setLoading(false)
        }
        
    }
    return (
        <>
            <div className='w-full pt-16'>
                <div className='w-full p-8 flex flex-col items-center space-y-16 mb-8'>
                    <div className='text-center text-3xl font-medium'>Track your Parcel</div>

                    <form className="flex flex-col items-center  space-y-8" onSubmit={handleSubmit}>
                        {/* <div className='flex space-x-8'>

            <div className='flex space-x-1'>
            <input type="radio" id='awb' name='isWaybill' checked value={true} onChange={handleChange} />
            <label htmlFor="awb">AWB</label>
            </div>
            <div className='flex space-x-1'>
            <input type="radio" id='order' name='isWaybill' value={false} onChange={handleChange} />
            <label htmlFor="order">Order Id</label>
            </div>
            </div> */}
                        <div className='flex'>
                            <input type="text" name="awb" value={formData.awb} onChange={handleChange} className="border py-2 px-4 sm:rounded-l-xl bg-blue-50" placeholder="Enter Tracking Id/AWB" />
                            <button className="border py-2 px-4 sm:rounded-r-xl bg-blue-50" disabled={loading}>{loading?'Tracking...' : 'Track'}</button>
                        </div>
                    </form>
                </div>
            </div>
            {trackingData && <Result data={trackingData} />}
        </>
    )
}

const Card = ({ scan }) => {
    return (
        <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan.Instructions}</div>
                <div>{scan.ScannedLocation}</div>
                <div>{scan.ScanDateTime}</div>
            </div>
        </div>
        </>
    )
}
const FlightGoCard = ({ scan }) => {
    return (
        <>
            <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.event_at}</div>
                <div>{scan.event_location}</div>
                <div className="absolute right-8 cursor-pointer">{scan.event_description}</div>
            </div>
        </>
    )
}
const MovinCard = ({ scan }) => {
    return (
        <>
            <div className="w-full h-16 bg-white relative items-center px-8 flex border-b space-x-4">
                <div>{scan.timestamp}</div>
                <div className="absolute right-8 cursor-pointer">{scan.package_status}</div>
            </div>
        </>
    )
}

const PickrrCard = ({ scan }) => {
    return (
        <>
            <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
                <div className='flex flex-col items-center justify-center'>
                    <div className='font-bold'>{scan.remarks}</div>
                    <div>{scan.location}</div>
                    <div>{scan.timestamp}</div>
                </div>
            </div>
        </>
    )
}

const DillikingCard = ({ scan }) => {
    const date = scan.event_date;
    const time = scan.event_time;
    const formattedDate = `${date.substr(0,4)}/${date.substr(4,6)}/${date.substr(6,8)}`
    const formattedTime = `${time.substr(0,2)}:${time.substr(2,4)}`
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan.remark}</div>
                <div>{scan.location}</div>
                <div>{`${formattedDate} ${formattedTime}`}</div>
            </div>
        </div>
    </>
    )
}

const ShiprocketCard = ({ scan }) => {
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan["sr-status-label"]}</div>
                <div>{scan.location}</div>
                <div>{scan.date}</div>
            </div>
        </div>
    </>
    )
}

const M5CCard = ({ scan }) => {
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan?.EventDescription}</div>
                <div>{scan.Location}</div>
                <div>{scan.EventDate.substr(0,10)} {scan.EventTime}</div>
            </div>
        </div>
    </>
    )
}

const EnviaCard = ({ scan }) => {
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan?.description}</div>
                <div>{scan.location}</div>
                <div>{scan.date}</div>
            </div>
        </div>
    </>
    )
}

const AtlanticCourierCard = ({ scan }) => {
    return (
    <>
        <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
            <div className='flex flex-col items-center justify-center'>
                <div className='font-bold'>{scan?.Status}</div>
                <div>{scan.Location}</div>
                <div>{scan.EventDate1} {scan.EventTime1}</div>
            </div>
        </div>
    </>
    )
}

const Result = ({ data }) => {
    useEffect(() => {
        console.log(data)
    }, [data])
    return (
        <>
            <div className={`w-full p-8 overflow-hidden  `}>
                {data?.id == 1 ? data?.data.slice().reverse().map((scan, index) => (
                    <Card key={index} scan={scan.ScanDetail} />
                )) : null}
                {data?.id == 2 ? data?.data.slice().reverse().map((scan, index) => (
                    <Card key={index} scan={scan.ScanDetail} />
                )) : null}
                {data?.id == 3 ? data?.data.map((scan, index) => (
                    <MovinCard key={index} scan={scan} />
                )) : null}
                {data?.id == 4 ? data?.data.reverse().map((scan, index) => (
                    <PickrrCard key={index} scan={scan} />
                )) : null}
                {data?.id == 5? data?.data.map((scan, index) => (
                    <ShiprocketCard key={index} scan={scan} />
                )) : null}
                {data?.id == 6? data?.data.map((scan, index) => (
                    <EnviaCard key={index} scan={scan} />
                )) : null}
                {data?.id == 7 ? data?.data.map((scan, index) => (
                    <FlightGoCard key={index} scan={scan} />
                )) : null}
                {data?.id == 8? data?.data.map((scan, index) => (
                    <DillikingCard key={index} scan={scan} />
                )) : null}
                
                {data?.id == 9? data?.data.map((scan, index) => (
                    <M5CCard key={index} scan={scan} />
                )) : null}
                {data?.id == 10? data?.data.map((scan, index) => (
                    <AtlanticCourierCard key={index} scan={scan} />
                )) : null}
                
            </div>

        </>
    )
}

const DomesticTracking = () => {
    return (
        <>
            <Form />
        </>
    )
}

export default DomesticTracking
