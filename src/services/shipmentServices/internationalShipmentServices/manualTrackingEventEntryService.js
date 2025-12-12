
const API_URL = import.meta.env.VITE_APP_API_URL

const manualTrackingEventEntryService = async (refId, formData) => {
    try {
        const response = await fetch(`${API_URL}/shipment/track/manual-entry/${refId}`, {
            method: 'POST',
            headers: {
                'Authorization': localStorage.getItem('token'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        let data;
        try {
            data = await response.json();
        } catch {
            throw new Error("Something went wrong");
        }

        if (!data?.success) {
            throw new Error(data?.message);
        };
        
    } catch (error) {
        console.error(error);
        throw error instanceof Error ? error : new Error("An unexpected error occurred");
    }
}

export default manualTrackingEventEntryService;