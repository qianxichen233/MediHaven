const get_medicines = async (type) => {
    const params = new URLSearchParams({
        type,
    });

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/medicines?${params}`,
            {
                method: 'GET',
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData.medicines;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export { get_medicines };
