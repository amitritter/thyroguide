const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        const now = Date.now();
        const expiresAt = now + (30 * 24 * 60 * 60 * 1000);

        const store = getStore("patient_records");
        await store.setJSON(code, {
            ...data,
            createdAt: now,
            expiresAt: expiresAt
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, code: code, expiresAt: expiresAt })
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
