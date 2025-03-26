process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const express = require("express");
const http = require("http");
const axios = require("axios")
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");

const app = express();

app.use(cors());

var rawBodySaver = function (req, res, buf, encoding) {
    if (buf && buf.length) {
        req.rawBody = buf.toString(encoding || 'utf8');
    }
}

app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.raw({ verify: rawBodySaver, type: '*/*' }));
//app.use(multer().array());

app.use('/', express.static(__dirname + '/public'));
//app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.get("/", (req, res) => {
    res.send("Hello from server");
});

app.post("/ccb-appt-no-slots", (req, res) => {
    const data = `<env:Envelope xmlns:env="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsa="http://www.w3.org/2005/08/addressing">
	<env:Header>
		<wsa:Action>GetWOLineApptWinAvail</wsa:Action>
	</env:Header>
	<env:Body>
		<CCBAppointmentResponse>
	<wfmMessageNumber>
		<RESULT>
			<RESULT>ERROR</RESULT>
			<ERRORCODE>EAM-00006</ERRORCODE>
			<ERRORMESSAGE>No slots found</ERRORMESSAGE>
		</RESULT>
		<errorCode>EAM-00006</errorCode>
		<errorMessage>No slots found</errorMessage>
		<messageText>No slots found!</messageText>
		<messageCategory>90000</messageCategory>
		<messageNumber>11006</messageNumber>
	</wfmMessageNumber>
</CCBAppointmentResponse>
	</env:Body>
</env:Envelope>`;
    res.send(data);
})

app.get("/simple-geo-json", (req, res) => {
    const data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-120.545119, 46.997064]
                },
                "properties": {
                    "Parcel Number": "12345",
                    "Account ID": "1234567890"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-120.528613, 47.031632]
                },
                "properties": {
                    "Parcel Number": "54321",
                    "Account ID": "0987654321"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-120.558613, 47.051632]
                },
                "properties": {
                    "Parcel Number": "11223344",
                    "Account ID": "1231231123"
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-120.545119, 46.997064]
                },
                "properties": {
                    "Parcel Number": "11223344",
                    "Account ID": "1231231122"
                }
            }
        ]
    };

    res.send(data);

});

app.get("/c2m-geo-json", (req, res) => {

    const data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -120.5233688,
                        47.0059051
                    ]
                },
                "properties": {
                    "premiseId": "0001981343",
                    "parcelNumber": "793934",
                    "address": "1305 N VISTA RD",
                    "customerPhoneNumber": "(208) 250-0820",
                    "accountNumber": "6178425621",
                    "rateCode": "ST10",
                    "externalServicePointId": "080395886900",
                    "serviceType": "Storm Water",
                    "status": "Connected",
                    "meterLocation": "",
                    "genericNotes": "",
                    "servicePointType": "Storm Water Residential",
                    "routeNumber": "103",
                    "badgeNumber": "",
                    "serialNumber": "",
                    "manufacturer": "",
                    "model": "",
                    "multiplier": "",
                    "installDate": "",
                    "removalDate": "",
                    "disconnectedDate": "",
                    "lastTested": "",
                    "ertId": "",
                    "latestConsumption": "",
                    "lastReadDate": ""
                }
            },
            {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        -120.5233688,
                        47.0059051
                    ]
                },
                "properties": {
                    "premiseId": "0001981343",
                    "parcelNumber": "793934",
                    "address": "1305 N VISTA RD",
                    "customerPhoneNumber": "(208) 250-0820",
                    "accountNumber": "6178425621",
                    "rateCode": "WW110,W110",
                    "externalServicePointId": "360607473700",
                    "serviceType": "Water",
                    "status": "Connected",
                    "meterLocation": "NEC 28' E 7' N",
                    "genericNotes": "",
                    "servicePointType": "Water Residential",
                    "routeNumber": "103",
                    "badgeNumber": "W190748907",
                    "serialNumber": "190748907",
                    "manufacturer": "Badger",
                    "model": "BADGER-M25-5/8IN",
                    "multiplier": "1.000000",
                    "installDate": "2019-11-20-00.00.00",
                    "removalDate": "",
                    "disconnectedDate": "",
                    "lastTested": "",
                    "ertId": "79618005",
                    "latestConsumption": "27,062.00",
                    "lastReadDate": "2023-09-08"
                }
            }
        ]
    };
    res.send(data);

});

app.get("/log", (req, res) => {
    console.log(`############ Headers Start ####################`);
    console.log(req.headers);
    console.log(`############ Headers End ############`);
    console.log(`############ Raw Headers Start ############`);
    console.log(req.rawHeaders);
    console.log(`############ Raw Headers End ############`);
    console.log(`############ Body Start ############`);
    console.log(req.body);
    console.log(`############ Body End ############`);
    console.log(`############ Raw Body Start ############`);
    console.log(req.rawBody);
    console.log(`############ Raw Body End ############`);
    console.log(`############ Params Start ############`);
    console.log(req.params);
    console.log(`############ Params End ############`);
    console.log(`############ Query Start ############`);
    console.log(req.query);
    console.log(`############ Query End ############`);
    res.status(200).send(`See server logs for output.`);
});

app.post("/log", (req, res) => {
    console.log(`############ Headers Start ####################`);
    console.log(req.headers);
    console.log(`############ Headers End ############`);
    console.log(`############ Raw Headers Start ############`);
    console.log(req.rawHeaders);
    console.log(`############ Raw Headers End ############`);
    console.log(`############ Body Start ############`);
    console.log(req.body);
    console.log(`############ Body End ############`);
    console.log(`############ Raw Body Start ############`);
    console.log(req.rawBody);
    console.log(`############ Raw Body End ############`);
    console.log(`############ Params Start ############`);
    console.log(req.params);
    console.log(`############ Params End ############`);
    console.log(`############ Query Start ############`);
    console.log(req.query);
    console.log(`############ Query End ############`);
    //res.status(200).send(`See server logs for output.`);
    res.status(200).send(req.body);
});

app.post("/rest", (req, res) => {

    try {

        res.set('Content-Type', 'application/json');
        res.status(200).send(JSON.parse(req.rawBody));

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});

app.post("/soap", (req, res) => {

    try {

        res.set('Content-Type', 'application/xml');
        res.status(200).send(req.rawBody);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }

});

app.get("/test", async (req, res) => {
    try {

        const payload =
            '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/" > ' +
            '    <Header> ' +
            '        <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" ' +
            '                       xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"> ' +
            '            <wsu:Timestamp Id="TS-C89AFAC7C36167666616560847946653"> ' +
            '            <wsu:Created>2022-06-24T15:33:37.347Z</wsu:Created> ' +
            '            <wsu:Expires>2022-06-24T15:34:37.347Z</wsu:Expires> ' +
            '            </wsu:Timestamp> ' +
            '        </wsse:Security> ' +
            '    </Header> ' +
            '    <Body> ' +
            '        <read></read> ' +
            '    </Body> ' +
            '</Envelope> ';

        const username = `INTUSER`;
        const password = `f1)afd$E91`;
        const CCB_OPTIONS = {
            headers: {
                //'Authorization': 'Basic ' +
                //  Buffer.from(`${username}:${password}`).toString('base64'),
                'Content-Type': 'application/xml',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Cookie': 'ORA_OUAF_SERVER_TIME=1656356761036; ORA_OUAF_SESSION_EXP=1656360361036; ORA_OUAF_Language=ENG; ORA_OUAF_Locale_Info=en-US%2CTERTIARY; ORA_OUAF_Language_Dir=ltr; ORA_OUAF_CLIENT_TM_OFFSET=1656346470777; JSESSIONID=77Gl8UdrN8YdgR2GUWsEdvTRInzSCOupfxdUNE2OUu6Jh3JwBqx4!1316498745!NONE; _WL_AUTHCOOKIE_JSESSIONID=LVKi5NdFvYSciljlRMy-'
            },
            //timeout: `${tenant.keys.cis.timeout}`
        };

        //const FULL_URL = `https://shared-c2m-devint.originsmartops.com/ouaf/webservices/F1-HealthCheck`;
        const FULL_URL = `https://c4layitcw63vxhi5xin34ioleq.apigateway.us-ashburn-1.oci.customer-oci.com/v1/test`;
        //const resp = await axios.post(FULL_URL, payload, CCB_OPTIONS);
        const resp = await axios.get(FULL_URL, CCB_OPTIONS);
        console.log(`OK`);
        console.log(resp.data);

        res.status(200).send(resp.data.toString());

    } catch (error) {
        console.log(`ERROR`);
        console.log(error.response.data.problemDetailDocument || error);
        res.status(500).send(error);
    }

});

var server = http.createServer(app);
server.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});
