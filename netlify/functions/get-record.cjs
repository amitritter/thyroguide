const { getStore } = require("@netlify/blobs");

exports.handler = async function(event) {
    const code = event.queryStringParameters?.code?.toUpperCase();

    if (!code) {
        return { statusCode: 400, body: JSON.stringify({ error: "Code missing" }) };
    }

    try {
        const store = getStore("patient_records");
        const record = await store.get(code, { type: "json" });

        if (!record) {
            return { statusCode: 404, body: JSON.stringify({ error: "Code not found" }) };
        }

        if (record.expiresAt && Date.now() > record.expiresAt) {
            await store.delete(code);
            return { statusCode: 410, body: JSON.stringify({ error: "Code expired" }) };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(record)
        };
    } catch (error) {
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
