
const geocodingGoogleMapsService = async (address) => {
    try {
        if (!address) {
            throw new Error('Address is required');
        }
        const ApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!ApiKey) {
            throw new Error('Google Maps API Key is not set in environment variables');
        }
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${ApiKey}`);
        const data = await response.json();
        if (data.status !== 'OK') {
            throw new Error(`Geocoding API error: ${data.status} - ${data.error_message || 'No additional error message'}`);
        }
        const country = data.results[0]?.address_components?.find(component => component.types.includes('country'))?.long_name;
        const countryCode = data.results[0]?.address_components?.find(component => component.types.includes('country'))?.short_name;
        const state = data.results[0]?.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.long_name;
        const stateCode = data.results[0]?.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.short_name;
        const city = data.results[0]?.address_components?.find(component => component.types.includes('postal_town'))?.long_name
                    || data.results[0]?.address_components?.find(component => component.types.includes('locality'))?.long_name
                    || data.results[0]?.address_components?.find(component => component.types.includes('administrative_area_level_3'))?.long_name
                    || data.results[0]?.address_components?.find(component => component.types.includes('administrative_area_level_2'))?.long_name;
        return {country, countryCode, state, stateCode, city};
    } catch (error) {
        console.error(error);
        throw new Error('Error in Google Maps Geocoding Service');
    }
}

// const test = async () => {
//     const tests = [
//         'M4W 3L8 Toronto, ON, Canada',
//         '10001 New York, NY, USA',
//         'SW1A 1AA London, UK',
//         '110001 New Delhi, India',
//         '2000 Sydney, NSW, Australia'
//     ];
//     for (const testAddress of tests) {
//         const result = await geocodingGoogleMapsService(testAddress);
//         console.log(`Result for "${testAddress}":`, result);
//     }
// }

// test();

export default geocodingGoogleMapsService;