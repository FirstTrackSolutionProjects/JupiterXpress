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

const TrackingCard = ({ scan }) => {
    return (
        <>
            <div className="w-full py-3 bg-white relative items-center justify-center px-8 flex border-b space-x-4">
                <div className='flex flex-col items-center justify-center'>
                    <div className='font-bold'>{scan?.status}</div>
                    {scan?.description && <div>{scan.description}</div>}
                    {scan?.location && <div>{scan.location}</div>}
                    <div>{scan.timestamp}</div>
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
                {data?.data?.map((scan, index) => (
                    <TrackingCard key={index} scan={scan} />
                ))}
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
