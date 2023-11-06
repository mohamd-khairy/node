const { body, validationResult } = require("express-validator");
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || "http://fanar-aware.test";
const BASE_TOKEN = process.env.BASE_TOKEN || 'rcflvurTSTlRhFNZlmEgide7KZUiqRiywHpV8W0uSfVl0o6Tub91PCNwNWiUhDRf';
const external_api = BASE_URL + "/api/event-detection";

module.exports = function (app, io) {

    /***************************************** route fanar-image-event **************************************** */
    const ImageValidateData = [
        body("image").notEmpty().withMessage("image is required"),
        body("cam").notEmpty().withMessage("cam is required"),
        body("location").notEmpty().withMessage("location is required"),
        body("status").notEmpty().withMessage("status is required"),
    ];

    app.post(`/fanar-image-event`, ImageValidateData, (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { status, image, cam, location, people } = req.body
        const data = { status, image, cam, location, people };
        /** emit item event */
        emitEvent("newItemAdded", data);

        res.status(200).send({ message: "Data added" });
    });

    /***************************************** route fanar-count-event ************************************* */
    const CountValidateData = [
        body("people").notEmpty().withMessage("people is required"),
        body("location").notEmpty().withMessage("location is required"),
        body("date").notEmpty().withMessage("date is required"),
    ];

    app.post(`/fanar-count-event`, CountValidateData, (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array()[0].msg });
        }

        const { people, location, date } = req.body
        const data = { people, location, date };
        /** emit count event */
        emitEvent("newCountUpdated", data);
        /** push data to database */
        pushDataToExternalApi(external_api, data)

        res.status(200).send({ message: "Data added" });
    });

    /***************************************** Helper Functions ************************************* */
    async function emitEvent(event_name, data) {
        await io.emit(event_name, data);
    }

    async function pushDataToExternalApi(external_api, data) {
        axios.post(external_api, data, {
            headers: { "X-Authorization": BASE_TOKEN }
        }).then(response => {
            console.log('Response:', response.data);
        })
            .catch(error => {
                console.error('Error:', error);
            });
    }
};
