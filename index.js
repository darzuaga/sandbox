let payload = {
 endpoint: "newCampaign",
 params: {
    path: campaign.toString(),
    name: campaign.key(),
    uid: this.userId
 }
}

request
 .post(`http://lvh.me:8000/getresponse`)
 .send(payload)
 .end((err, res) => {
    console.log('newCampaignRes');
    console.log(res);
    console.log('newCampaignErr');
    console.log(err);
 })

 'newCampaign': function(data){

   let { name, path, uid } = data.params;
   let time = moment().unix();
   let payload = {
        method: 'post',
        body: {

           name: `danny_${time}`,
           optinTypes: {
                email: 'single',
                import: 'single',
                api: 'single',
                webform: 'single'
           }

        }
   }

   return this.request('campaigns', payload, data)
   .map( res => {
        let campaignId = res.campaignId;
        payload.response = res;
        payload.path = `${serviceRef.toString()}/${uid}/services/getresponse/campaigns/${campaignId}`
        serviceRef.child(`${uid}/services/getresponse/campaigns/${campaignId}`).update(payload)
        return payload
   })
},

 let serviceMap = {
 'getresponse': {
   'campaignId': 'key', // GetResponse:on the service
   'path': 'path', // GetResponse:email to this resource on firebase
   'title': 'response.campaignId', // GetResponse:the name our users give this campaign
   'campaignName': 'response.campaignId', // GetResponse:the name our users give this campaign
   'folder_id': 'response.campaignId' // GetResponse:the name our users give this campaign
 },
 'mailchimp': {
   'campaignId': 'key', // GetResponse:on the service
   'path': 'path', // GetResponse:email to this resource on firebase
   'title': 'params.name', // GetResponse:the name our users give this campaign
   'campaignName': 'params.name', // GetResponse:the name our users give this campaign
   'folder_id': 'mailchimp.folder_id' // GetResponse:the name our users give this campaign
 }
}

return <AweberListItem evtName={'getCampaign'} type={props.type} campaignId={key} path={get(email, serviceMap['path'])} title={get(email, serviceMap['title'])} campaignName={get(email, serviceMap['campaignName'])} folder_id={get(email, serviceMap['folder_id'])}/>

let serviceMap = props.serviceMap[props.esp];

params.data = data;
let { method, body } = params;

return Observable.create(observer => {
    superagent
        [method](`https://api.getresponse.com/v3/${url}`)
        .set('X-Auth-Token', 'api-key e2570957d857b653967e34e297c06e7c')
        .send(body)
        .end((error, response) => {
            console.log('errorFromServer');
            console.log(error);
            console.log('responseFromServer');
            console.log(util.inspect(response.body, false, null));
            if(response.body.httpStatus == undefined){
                observer.onNext(response.body)
            }
        })
})
