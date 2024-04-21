const get_physicians = async (department, name) => {
    const params_raw = {};
    if (!!department && department !== 'Any')
        params_raw['department'] = department;
    if (!!name) department['name'] = name;

    const params = new URLSearchParams(params_raw);

    try {
        const response = await fetch(
            `http://127.0.0.1:5000/api/physician?${params}`,
            {
                method: 'GET',
            },
        );

        if (response.ok) {
            const responseData = await response.json();
            return responseData.physicians;
        } else {
            console.error('Failed to fetch data');
        }
    } catch (error) {
        console.error('Error:', error);
    }
};

export { get_physicians };
