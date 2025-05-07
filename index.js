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
	<wfmMessageNumber>101</wfmMessageNumber>
</CCBAppointmentResponse>
	</env:Body>
</env:Envelope>`;
    res.send(data);
});

app.use('/verify-badge-number', (req, res) => {

    const data =
        `<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
                <SOAP-ENV:Header>
                    <wsse:Security SOAP-ENV:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                        <wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                            <wsu:Created>2024-12-18T22:13:06Z</wsu:Created>
                            <wsu:Expires>2024-12-18T22:14:06Z</wsu:Expires>
                        </wsu:Timestamp>
                    </wsse:Security>
                </SOAP-ENV:Header>
                <SOAP-ENV:Body>
                    <ValidateMeterItemResponse xmlns="http://splwg.com/ValidateMeterItemResponse.xsd">
                        <ValidateMeterItemService>
                            <ValidateMeterItemHeader BadgeNumber="" ExternalID="" ExternalMessageID="" FieldActivityID="" Language="" MeterIdNumber="" MeterIdType="" MeterItemFlag="" SerialNumber="" ServicePointID=""/>
                            <ValidateMeterItemDetails BadgeNumber="TEST123450" ExternalID="" ExternalMessageID="" FieldActivityID="" Manufacturer="M-M" MessageNumber="0" MessageText="" MeterConfigurationType="WTR-SINGLE" MeterIdNumber="" MeterIdType="" MeterItemFlag="M" Model="N/A" SerialNumber="" ServicePointID="1280530910" ValidationStatus="Y">
                            <Registers>
                                <RegistersHeader EffectiveDateTime="2015-11-30T01:00:00" LastReadingSequence="1" MeterID="1150672949"/>
                                <RegistersRow ChannelID="10909956" ConsumptiveSubtractive="S" EffectiveDateTime="2015-11-30T01:00:00" FullScale="0.0000000" HighLimit="986.000000" HowToUse="+" Interval="false" IntervalRegisterType="" IntvDescription="" LowLimit="982.000000" MeterID="1150672949" NumberofDigitsLeft="4" NumberofDigitsRight="0" Protocol="" ProtocolDescription="" ReadOutType="DIALS" ReadOutTypeDescription="Dials" RegisterConstant="1.000000" RegisterID="1150918262" RegisterInformation="CCF, format 4.0, 1.000000, Additive" RegistryType="Register" Seq="1" TimeofUse="" TimeofUseDescription="" Tolerance="0.00000" UnitofMeasure="CCF" UnitofMeasureDescription="100 cubic feet of water" Version="1">
                                    <RegistryCharacteristics>
                                        <RegistryCharacteristicsHeader LastCharacteristicTypeCode="" LastSequenceNumber="0" ListDefaultForFlag="" RegisterID="1150918262"/>
                                    </RegistryCharacteristics>
                                </RegistersRow>
                            </Registers>
                            </ValidateMeterItemDetails>
                        </ValidateMeterItemService>
                    </ValidateMeterItemResponse>
                </SOAP-ENV:Body>
            </SOAP-ENV:Envelope>`;
            
    res.send(data);
});

app.use('/ouaf/webservices/xla/ExtractFAInfo', (req, res) => {

    const data = `
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">
        <SOAP-ENV:Header>
            <wsse:Security SOAP-ENV:mustUnderstand="1" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
                <wsu:Timestamp xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
                    <wsu:Created>2024-12-20T19:28:46Z</wsu:Created>
                    <wsu:Expires>2024-12-20T19:29:46Z</wsu:Expires>
                </wsu:Timestamp>
            </wsse:Security>
        </SOAP-ENV:Header>
        <SOAP-ENV:Body>
            <ExtractFAInfo xmlns="http://splwg.com/ExtractFAInfo.xsd">
                <ExtractFAInfoService>
                    <ExtractFAInfoHeader FieldActivityID=""/>
                    <ExtractFAInfoDetails ActivityType="HBI" Address="123 &amp; 125 W Green St" Address2="" Address3="" AddressLine4="" AddressUppercase="123 &amp; 125 W GREEN ST" AlertInformation="" AllowMRRoute="true" AppSchedId2="" AppointmentSetup="APOP" ApptPeriodID="" BadgeNbr2="" BadgeNumber="SE96172163" BusinessObject="" CISDivision="GSWC" CancelReasonCode="" ChgAlgCalledSwitch="false" City="Claremont" CityUppercase="CLAREMONT" Country="USA" County="Los Angeles" CreateDateTime="2024-12-05-11.28.41" CreatedBy="US" DESCR2="Water -  Multi Unit - GSWC" DateReceived="2023-06-01" Description="HIGH BILL INVESTIGATION" Descrlong2="" Descrlong3="" Descrlong4="" DetailedDescription="" DeviceTypeDescription="Water CCF - 5/8&quot;" DisconnectLocation="" DispGrpCd2="" DispatchGroup="MWM141" DisplayasAlert="false" EligDispatchSw2="true" EligibleforDispatch="true" ExtServReqFlg2="C1NO" ExternalID="" ExternalServiceRequestsFlag="C1NO" FATYPECHANGESW="false" FaCanRsnDescription="" FaPriorityFlg2="20" FaStatusDescription="Pending" FaTypeCd2="HBI" FacLvlName1="" FacLvlName2="" FacLvlName3="" FacilityLevel1="" FacilityLevel2="" FacilityLevel3="" FieldActivityDataArea="&lt;cmMeterReadHistoryDetails>
            &lt;showMeterReadHistory>true&lt;/showMeterReadHistory>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-11-05T10:32:01&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>2.000000&lt;/readDifference>
                &lt;readMessage>Usage: 2, no high/low&lt;/readMessage>
                &lt;reading>538.000000&lt;/reading>
                &lt;readType>70&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-11-04T16:17:48&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>82.000000&lt;/readDifference>
                &lt;readMessage>Non-billable Usage: 82, Valid Usage: 4 - 43, Valid Readings: 458 - 497&lt;/readMessage>
                &lt;reading>536.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>false&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-10-04T12:54:40&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>66.000000&lt;/readDifference>
                &lt;readMessage>Usage: 66, Valid Usage: 6 - 58, Valid Readings: 394 - 446&lt;/readMessage>
                &lt;reading>454.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-09-06T11:17:19&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>61.000000&lt;/readDifference>
                &lt;readMessage>Usage: 61, Valid Usage: 6 - 56, Valid Readings: 333 - 383&lt;/readMessage>
                &lt;reading>388.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-08-07T10:58:42&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>9948.000000&lt;/readDifference>
                &lt;readMessage>Usage: 9,948, no high/low&lt;/readMessage>
                &lt;reading>327.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-08-06T11:33:11&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>117.000000&lt;/readDifference>
                &lt;readMessage>Non-billable Usage: 117, Valid Usage: 7 - 71, Valid Readings: 269 - 333&lt;/readMessage>
                &lt;reading>379.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>false&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-07-05T12:28:25&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>30.000000&lt;/readDifference>
                &lt;readMessage>Usage: 30, Valid Usage: 6 - 58, Valid Readings: 238 - 290&lt;/readMessage>
                &lt;reading>262.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-06-06T13:32:21&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>27.000000&lt;/readDifference>
                &lt;readMessage>Usage: 27, Valid Usage: 7 - 66, Valid Readings: 212 - 271&lt;/readMessage>
                &lt;reading>232.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-05-06T12:58:23&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>35.000000&lt;/readDifference>
                &lt;readMessage>Usage: 35, Valid Usage: 6 - 57, Valid Readings: 176 - 227&lt;/readMessage>
                &lt;reading>205.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-04-04T14:19:59&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>14.000000&lt;/readDifference>
                &lt;readMessage>Usage: 14, Valid Usage: 5 - 49, Valid Readings: 161 - 205&lt;/readMessage>
                &lt;reading>170.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-03-07T10:43:42&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>9001.000000&lt;/readDifference>
                &lt;readMessage>Usage: 9,001, no high/low&lt;/readMessage>
                &lt;reading>156.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>true&lt;/useOnBill>
            &lt;/meterReadHistoryList>
            &lt;meterReadHistoryList>
                &lt;badgeNumber>SE96172163&lt;/badgeNumber>
                &lt;readingDate>2024-03-06T12:22:56&lt;/readingDate>
                &lt;readSequence>1&lt;/readSequence>
                &lt;readDifference>1024.000000&lt;/readDifference>
                &lt;readMessage>Non-billable Usage: 1,024, Valid Usage: 6 - 58, Valid Readings: 137 - 189&lt;/readMessage>
                &lt;reading>1155.000000&lt;/reading>
                &lt;readType>60&lt;/readType>
                &lt;useOnBill>false&lt;/useOnBill>
            &lt;/meterReadHistoryList>
        &lt;/cmMeterReadHistoryDetails>" FieldActivityID="8390034271" FieldActivityPriority="20" FieldActivityStatus="P" FieldActivityTypeProfile="MTR-GSWM" FieldOrderID="" FieldServiceClass="METER" FieldworkRescheduleReason="" Filler="-" FsClCd2="METER" HouseType="" IdentifyingGeographicType="" InCityLimit="false" InstallDate="1946-07-01" InstructionDetails="" Instructions="" IntermediateStatus="" ItemID="" ItemMfgDescription="" ItemModelDescription="" ItemStatusDescription="" ItemTypDescription="" ItemType="" Key="false" KeyID="" KeyId2="" KeySw2="false" LSSLDescription="" LandlordAgreementID="" LandlordDescription="" LandlordEntityName="" Language="ENG" LanguageCode2="ENG" LifeSupportSensitiveLoad="N" LocationDetails="1F W/EPL                      FR/" LsSlFlagDescription="None" METERREADER="" MailingAddress="true" Manufacturer="SENSUS" MaximumAppointments="0" MessageId="" MeterConfigId2="3029136011" MeterConfigurationID="" MeterConfigurationType="WTR-SINGLE" MeterDataArea="" MeterID="3025841737" MeterId2="" MeterInstallDatetime="2023-09-14-11.19.09.000000" MeterLocation="FR" MeterMfgDescription="SE - Sensus Corporation" MeterModelDescription="NOT APPLICABLE" MeterReadID="302728990494" MeterReadInstructionCode="" MeterReadSource="MWM" MeterReadWarning="" MeterStatus="A" MeterStatusDescription="Active" MeterType="W-CCF-9" MeterreadInstrCd2="" MeterreadInstrDescription="" MeterreadInstrDetails2="" MeterreadWarnCd2="" MeterreadWarnDescription="" MfgCd2="" Model="N/A" ModelCd2="" MsgDate="2024-12-05" MsgDateDd="05" MsgDateDel1="-" MsgDateDel2="-" MsgDateMm="12" MsgDateYyyy="2024" MsgDatetime="2024-12-05-11.28.45.000000" MsgTime="11.28.45.000000" MsgTimeDlm1="." MsgTimeDlm2="." MsgTimeDlm3="." MsgTimeFs="000000" MsgTimeHh="11" MsgTimeMi="28" MsgTimeSs="45" MultipleRouteUsage="C1NA" NbrDaysAlertActive="0" Number2="" OKtoEnter="false" OkToEnterSw2="false" OperationsArea="CLMT" OverridePremiseFieldInformation="N" PREMTYPEDESCRDescription="Multi Family" ParentPremiseID="" Postal="91711" PremiseDataArea="" PremiseID="8398130730" PremiseId2="8398130730" PremiseNumber="" PremiseType="MULTI" ReadCycle="54" ReadCycleRouteSequence="2510" ReadDateTime="2024-11-05-10.32.01" ReadRoute="0635" RetireReasonCode="" RetireRsnCd2="" SPDataArea="" SPType="W-MULTI" ScheduleDateTimeStart="2024-12-20-00.00.00" SerialNbr2="" SerialNumber="96172163" ServicePointID="8398130709" ServicePointSourceStatus="C" ServicePointStatus="R" ServiceType="W" ServicepointDiscLocDescription="" ServicepointId2="8398130709" ServicepointId3="8398130709" ServicepointLocDescription="FRONT" ServicepointOpAreaDescription="CLAREMONT" ServicepointSrcStatusDescription="Connected" ServicepointStatusDescription="In Service" ServicepointTypeCd2="W-MULTI" State="CA" Status="" SubType="M" TaxVendorGeographicalCode="117" TestSelectionID="" TimeZone="USPACIFIC" TrendArea="141" TrendClass="R" UseOnBill="true" User="TRAIN02" Version="14" Version10="1" Version11="0" Version2="1" Version3="0" Version4="9" Version5="7" Version6="1" Version7="3" Version8="2" Version9="0">
                    <FatyCharacteristic>
                        <FatyCharacteristicHeader ActivityType="HBI" CopyToFaTypeCode="" LastCharacteristicTypeCode="MRHEXT" LastSequenceNumber="30"/>
                        <FatyCharacteristicRow ActivityType="HBI" AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Yes" CharacteristicType="CMSINGST" CharacteristicValue="Y" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" InfoProgramName="" NavigationOption="" SearchNavigationKey="" Sequence="20" Table="" TypeofCharValue="DFV" Version="1"/>
                        <FatyCharacteristicRow ActivityType="HBI" AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Read Meter (MWM)" CharacteristicType="JOBCD" CharacteristicValue="MR01" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" InfoProgramName="" NavigationOption="" SearchNavigationKey="" Sequence="10" Table="" TypeofCharValue="DFV" Version="1"/>
                        <FatyCharacteristicRow ActivityType="HBI" AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Yes" CharacteristicType="MRHEXT" CharacteristicValue="Y" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" InfoProgramName="" NavigationOption="" SearchNavigationKey="" Sequence="30" Table="" TypeofCharValue="DFV" Version="1"/>
                    </FatyCharacteristic>
                    <FASteps>
                        <FAStepsHeader ActivityType="HBI" FATYPECHANGESW="false" FieldActivityID="8390034271" LastStepSeqNumber="10" WFaStatusBefore=""/>
                        <FAStepsRow AccountID="" ActivityType="" CustomerContactID="" DeviceTestID="" FAStepTypeAction="MR" FaStepInfo="No Meter Read Information" FaStepTypeInfo="READ METER" FieldActivityID="8390034271" ItemID="" MTR_ID="" MeterID="" MeterReadID="" SPItemHistoryID="" SPMeterHistoryID="" ServicePointID="" SpawnedFAID="" StepID="" StepIDLabel="Meter Read ID" StepSequence="10" StepUpdateEntity="MR" Version="1" WorkFAStatusBefore=""/>
                    </FASteps>
                    <FACharacteristics>
                        <FACharacteristicsHeader ActivityType="" FieldActivityID="8390034271" LastCharacteristicTypeCode="CUSREQFA" LastSequenceNumber="10" LastSortSeq="10" ListDefaultForFlag=""/>
                        <FACharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="CUSTOMER REQUESTED FIELD ACTIVITY" CharacteristicType="CUSREQFA" CharacteristicTypeDescription="CUSTOMER REQUESTED FIELD ACTIVITY" CharacteristicValue="YES" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" FieldActivityID="8390034271" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="YES" SearchNavigationKey="" Sequence="10" Table="" TypeofCharValue="DFV" Version="1"/>
                    </FACharacteristics>
                    <ServicepointTypeCharacteristic>
                        <ServicepointTypeCharacteristicHeader CopyToServicepointTypeCode="" LastCharacteristicTypeCode="" LastSequenceNumber="0" SPType="W-MULTI"/>
                    </ServicepointTypeCharacteristic>
                    <ServicepointMult>
                        <ServicepointMultHeader ServicePointID="8398130709"/>
                    </ServicepointMult>
                    <ServicepointEquipment>
                        <ServicepointEquipmentHeader LastInstallDate="" LastItemIDEquipment="" ServicePointID="8398130709"/>
                    </ServicepointEquipment>
                    <SPCharacteristics>
                        <SPCharacteristicsHeader LastCharacteristicTypeCode="" LastSortSeq="0" ServicePointID=""/>
                        <SPCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="1&quot; Service Line" CharacteristicType="SERVSIZE" CharacteristicTypeDescription="Service Size-GSWC" CharacteristicValue="1&quot;" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="10" ServicePointID="8398130709" Table="" TypeofCharValue="DFV" Version="1"/>
                        <SPCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Copper" CharacteristicType="SERVTYPE" CharacteristicTypeDescription="Service Type-GSWC" CharacteristicValue="COPPER" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="20" ServicePointID="8398130709" Table="" TypeofCharValue="DFV" Version="1"/>
                        <SPCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="3/4&quot;" CharacteristicType="CMSVSIZE" CharacteristicTypeDescription="Customer Service Line Size - GSWC" CharacteristicValue="75" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="2024-03-07" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="21" ServicePointID="8398130709" Table="" TypeofCharValue="DFV" Version="1"/>
                        <SPCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Copper" CharacteristicType="CMSVTYPE" CharacteristicTypeDescription="Customer Service Line Type - GSWC" CharacteristicValue="COPPER" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="2024-03-07" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="22" ServicePointID="8398130709" Table="" TypeofCharValue="DFV" Version="1"/>
                        <SPCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="5/8&quot; meter" CharacteristicType="MTR SIZE" CharacteristicTypeDescription="Meter Sizes Used for Service Charges" CharacteristicValue="9" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="91" ServicePointID="8398130709" Table="" TypeofCharValue="DFV" Version="1"/>
                    </SPCharacteristics>
                    <ServicepointGeo>
                        <ServicepointGeoHeader LastGeographicTypeCode="" ServicePointID="8398130709"/>
                    </ServicepointGeo>
                    <ServicepointOpa>
                        <ServicepointOpaHeader LastFsClCode="UNMTR" ServicePointID="8398130709"/>
                        <ServicepointOpaRow Description="CLAREMONT" FieldServiceClass="METER" OperationsArea="CLMT" ServicePointID="8398130709" Version="1"/>
                        <ServicepointOpaRow Description="CLAREMONT" FieldServiceClass="UNMTR" OperationsArea="CLMT" ServicePointID="8398130709" Version="1"/>
                    </ServicepointOpa>
                    <AlternateAddress>
                        <AlternateAddressHeader LastPremiseAltAddressID="" PremiseID="8398130730"/>
                    </AlternateAddress>
                    <Plf>
                        <PlfHeader LastSequenceNumber="0" PersonID="" PhoneTypeFlag=""/>
                    </Plf>
                    <PerContDetl>
                        <PerContDetlHeader LastC1ContactId="" PersonID=""/>
                    </PerContDetl>
                    <PremiseCharacteristics>
                        <PremiseCharacteristicsHeader LastCharacteristicTypeCode="" PremiseID=""/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Claremont" CharacteristicType="CITY" CharacteristicValue="117" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="CLAREMONT" CharacteristicType="COSTCODE" CharacteristicValue="317" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Claremont CSA" CharacteristicType="CSA" CharacteristicValue="141" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Foothill District" CharacteristicType="DISTRICT" CharacteristicValue="FOOTHILL" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="RES - 2, 3 OR 4 DWELLING UNITS - SERVED BY 1 METER" CharacteristicType="NAICS" CharacteristicValue="2" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="2017-01-06" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Region 3" CharacteristicType="REGION" CharacteristicValue="300" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                        <PremiseCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="Claremont - Lower" CharacteristicType="SYSGRAD" CharacteristicValue="14-02-03" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="1946-07-01" InfoProgramName="" NavigationOption="" PremiseID="8398130730" SearchCharacteristicValue="" SearchNavigationKey="" Table="" TypeofCharValue="DFV" Version="1"/>
                    </PremiseCharacteristics>
                    <PremiseGeoTypes>
                        <PremiseGeoTypesHeader LastGeographicTypeCode="SYSTEM" PremiseID="8398130730"/>
                        <PremiseGeoTypesRow GeographicType="LATITUDE" GeographicValue="34.09227863" GeographicValueFormat="" PremiseID="8398130730" Version="1"/>
                        <PremiseGeoTypesRow GeographicType="LONGITUD" GeographicValue="-117.7155531" GeographicValueFormat="" PremiseID="8398130730" Version="1"/>
                        <PremiseGeoTypesRow GeographicType="SYSTEM" GeographicValue="WGS 1984" GeographicValueFormat="" PremiseID="8398130730" Version="1"/>
                    </PremiseGeoTypes>
                    <MeterIDs>
                        <MeterIDsHeader LastMeterIDTypeCode="" MeterID="3025841737"/>
                    </MeterIDs>
                    <MeterCharacteristics>
                        <MeterCharacteristicsHeader LastCharacteristicTypeCode="" LastSortSeq="0" MeterID=""/>
                        <MeterCharacteristicsRow AdhocCharacteristicValue="" CharValFKInfo="" CharValForeignKeys="" CharValueDescription="5/8&quot;x3/4&quot; meter" CharacteristicType="METERSIZ" CharacteristicTypeDescription="Meter Size" CharacteristicValue="9" CharacteristicValueFK1="" CharacteristicValueFK2="" CharacteristicValueFK3="" CharacteristicValueFK4="" CharacteristicValueFK5="" CharateristicValue="" CompoundPKSwitch="false" EffectiveDate="2023-08-28" InfoProgramName="" MeterID="3025841737" NavigationOption="" SearchCharacteristicValue="" SearchNavigationKey="" Sequence="10" Table="" TypeofCharValue="DFV" Version="1"/>
                    </MeterCharacteristics>
                    <MeterEquipment>
                        <MeterEquipmentHeader LastInstallDate="" LastItemIDEquipment="" MeterID="3025841737"/>
                    </MeterEquipment>
                    <Registers>
                        <RegistersHeader EffectiveDateTime="2023-06-01-00.00.00" LastReadingSequence="1" MeterID="3025841737"/>
                        <RegistersRow ChannelID="" ConsumptiveSubtractive="S" EffectiveDateTime="2023-06-01-00.00.00" FullScale="0.0000000" HighLimit="606.000000" HowToUse="+" Interval="false" IntervalRegisterType="" IntvDescription="" LowLimit="545.000000" MeterID="3025841737" NumberofDigitsLeft="4" NumberofDigitsRight="0" Protocol="" ProtocolDescription="" ReadOutType="DIGITAL" ReadOutTypeDescription="Digital" RegisterConstant="1.000000" RegisterID="3023500674" RegisterInformation="CCF, format 4.0, 1.000000, Additive" RegistryType="Register" Seq="1" TimeofUse="" TimeofUseDescription="" Tolerance="0.00000" UnitofMeasure="CCF" UnitofMeasureDescription="100 cubic feet of water" Version="1">
                            <RegistryCharacteristic>
                                <RegistryCharacteristicHeader LastCharacteristicTypeCode="" LastSequenceNumber="0" ListDefaultForFlag="" RegisterID="3023500674"/>
                            </RegistryCharacteristic>
                            <RegistryCharacteristics/>
                        </RegistersRow>
                    </Registers>
                    <RegisterReading>
                        <RegisterReadingHeader LastReadingSequence="1" MeterConfigurationID="3029136011" MeterReadID="302728990494" ReadDateTime="2024-11-05-10.32.01" ServicePointID="8398130709"/>
                        <RegisterReadingRow HighLimit="0.000000" LowLimit="0.000000" MeterConfigurationID="" MeterReadID="302728990494" PrevMeterreadID="302740868013" PrevRegistryReadInfo="Regular, 10-04-2024, 454" ReadOutsideLimit="false" ReadType="70" RegisterID="3023500674" RegisterInformation="CCF, format 4.0, 1.000000, Additive" RegisterReading="538.000000" RegisterReadingID="302458926063" RegisterReadingMessage="Usage: 84, no high/low" ReviewHighLow="false" Seq="1" Trended="true" Version="2"/>
                    </RegisterReading>
                    <ItemCharacteristics>
                        <ItemCharacteristicsHeader ItemID="" LastCharacteristicTypeCode="" LastSortSeq="0"/>
                    </ItemCharacteristics>
                    <ItmEquipment>
                        <ItmEquipmentHeader ItemID="" LastInstallDate="" LastItemIDEquipment=""/>
                    </ItmEquipment>
                    <SAInfo>
                        <SAInfoHeader/>
                        <SAInfoRow AccountID="5818830000" CISDivision="GSWC" CallOrigFmFlg="" CustomerRead="N" HowToUseSP="+" RateSchedule="R31NRM" SASPID="5814742840" SAStatus="20" SAType="COMM" ServiceAgreement="5817016581" ServiceAgreementID2="5817016581" ServicePointID="8398130709" StartDate="2017-01-06" StartDateTime="2017-01-06-00.00.00" StartMeterRead="839714675822" StopMeterRead="" SubType="" UsePercent="100" Version="1"/>
                    </SAInfo>
                    <AccountInfo>
                        <AccountInfoHeader/>
                        <AccountInfoRow AccessGroup="***" AccountDataArea="" AccountID="5818830000" AccountManagementGroup="" AccountName="Randin,David" AffectCashOnlyScoreBy="0" AffectCreditRatingBy="1000" AlertInformation="" ArsAmount0ToXDays="0.00" ArsAmount3160Days="0" ArsAmount61OlderDays="0" ArsAmountDisputed="0.00" ArsAmountXTo30Days="0" BillCycle="54" BillPrintIntercept="" BudgetPlan="" CISDivision="GSWC" CollectionClass="COLLECTION" CurrencyCode="USD" CurrentAmount="0.00" CustomerClass="RES" DisputedAmount="0.00" InternalCreditReview="false" LastCreditReviewDate="2024-12-02" MailingPremiseID="8398130730" MainPersonID="6220230000" NoDepositReviewSwitch="false" PayoffAmount="0.00" PersonBusiness="P" PersonLsSlDescription="" PersonLsSlFlag="N" PersonLsSlFlagDescription="None" ProtectBillCycle="false" ProtectDivision="false" ProtectMailingPremise="false" QuickAddSwitch="false" SetUpDate="2007-11-14" Version="4">
                            <Plf2>
                                <Plf2Header LastSequenceNumber="0" PersonID="" PhoneTypeFlag=""/>
                                <Plf2Row Extension="" IntlPrefix="" PersonID="6220230000" PhoneNumber="(555) 555-5555" PhoneType="HOME" PhoneTypeFlag="" Sequence="1"/>
                            </Plf2>
                            <PerContDetl2>
                                <PerContDetl2Header LastC1ContactId="" PersonID=""/>
                            </PerContDetl2>
                            <BillInfo>
                                <BillInfoHeader/>
                                <BillInfoRow BillAmount="580.83" BillDate="2024-11-06" BillID="581531170625"/>
                                <BillInfoRow BillAmount="463.75" BillDate="2024-10-07" BillID="581497119166"/>
                                <BillInfoRow BillAmount="431.21" BillDate="2024-09-09" BillID="581754570411"/>
                                <BillInfoRow BillAmount="461.90" BillDate="2024-08-07" BillID="581191146070"/>
                                <BillInfoRow BillAmount="232.54" BillDate="2024-07-08" BillID="581089475900"/>
                                <BillInfoRow BillAmount="212.76" BillDate="2024-06-07" BillID="581459348591"/>
                            </BillInfo>
                            <PaymentInfo>
                                <PaymentInfoHeader/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="580.83" PaymentDate="2024-11-27" PaymentEventID="581159150753" PaymentID="581961239797"/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="463.75" PaymentDate="2024-10-28" PaymentEventID="581351294808" PaymentID="581656593397"/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="431.21" PaymentDate="2024-09-30" PaymentEventID="581604224124" PaymentID="581895338691"/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="461.90" PaymentDate="2024-08-28" PaymentEventID="581706948087" PaymentID="581218376351"/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="232.54" PaymentDate="2024-07-29" PaymentEventID="581840514868" PaymentID="581545167653"/>
                                <PaymentInfoRow CanRsnDescription="" CancelReason="" PaymentAmount="212.76" PaymentDate="2024-06-28" PaymentEventID="581286494559" PaymentID="581989910465"/>
                            </PaymentInfo>
                        </AccountInfoRow>
                    </AccountInfo>
                    <FcOpt>
                        <FcOptHeader/>
                        <FcOptRow OptionType="AFCD" Sequence="1" Value="APPTFRCD"/>
                        <FcOptRow OptionType="AFRC" Sequence="1" Value="Y"/>
                        <FcOptRow OptionType="AMAC" Sequence="1" Value="Y"/>
                        <FcOptRow OptionType="AMAP" Sequence="1" Value="Y"/>
                        <FcOptRow OptionType="AMRS" Sequence="1" Value="N"/>
                        <FcOptRow OptionType="ANAP" Sequence="1" Value="Y"/>
                        <FcOptRow OptionType="APPD" Sequence="1" Value="5"/>
                        <FcOptRow OptionType="BSNO" Sequence="1" Value="BUSN"/>
                        <FcOptRow OptionType="FXNO" Sequence="1" Value="FAX"/>
                        <FcOptRow OptionType="HMNO" Sequence="1" Value="HOME"/>
                        <FcOptRow OptionType="ISFC" Sequence="1" Value="MUOS"/>
                        <FcOptRow OptionType="ISSM" Sequence="1" Value="CREX"/>
                        <FcOptRow OptionType="ISSM" Sequence="2" Value="ACRW"/>
                        <FcOptRow OptionType="JACL" Sequence="1" Value="com.splwg.wfmi.workforce.SPLWFMSystem"/>
                        <FcOptRow OptionType="MSEQ" Sequence="1" Value="CI_WFM_MSGID_SEQ"/>
                        <FcOptRow OptionType="SPRV" Sequence="1" Value="CI_SPLMWM"/>
                        <FcOptRow OptionType="TODO" Sequence="1" Value="TD-FARSP"/>
                    </FcOpt>
                    </ExtractFAInfoDetails>
                </ExtractFAInfoService>
            </ExtractFAInfo>
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    `;

    res.set('Content-Type', 'text/xml; charset=utf-8').send(data);

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
    res.status(200).send(req.rawBody);
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
