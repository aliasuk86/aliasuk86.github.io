import { config } from './config.js';

const { NOTION_TOKEN, DATABASE_ID } = config;

document.getElementById('notionForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const data = {
        xdrip: formData.get('xdrip'),
        iob: formData.get('iob'),
        insulin: formData.get('insulin'),
        status: formData.get('status'),
        food: formData.get('food'),
    };

    try {
        const response = await fetch("https://api.notion.com/v1/pages", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${NOTION_TOKEN}`,
                "Content-Type": "application/json",
                "Notion-Version": "2022-06-28",
            },
            body: JSON.stringify({
                parent: { database_id: DATABASE_ID },
                properties: {
                    Xdrip: { number: parseFloat(data.xdrip) },
                    IOB: { number: parseFloat(data.iob) },
                    Insulin: { number: parseFloat(data.insulin) },
                    Status: { number: parseFloat(data.status) },
                    Food: { title: [{ text: { content: data.food } }] },
                },
            }),
        });

        if (response.ok) {
            alert("Data submitted successfully!");
        } else {
            const error = await response.json();
            console.error("Error submitting data:", error);
            alert("Failed to submit data. Check console for details.");
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        alert("An unexpected error occurred. Check console for details.");
    }
});
