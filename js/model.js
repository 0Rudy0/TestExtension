var candidateDataModel;

function setEmptyModel() {
	candidateDataModel = {
		mainData: {
			fullName: '',
			title: '',
			profileImgUrl: '',
			location: '',
			contactInfo: {
				email: '',
				phone: ''
			},
			socialNetworks: {
				linkedin: '',
				facebook: '',
				github: '',
				skype: '',
				stackoverflow: '',
				angellist: '',
				xing: '',
				twitter: '',
				googlePlus: ''
			},
			summary: '',
			education: [
				//{ title: '', atPlace: '', placeLink: '', placeLogo: '', startDate: moment('2006-09-01'), endDate: moment('2011-09-01') }	
			],
			experience: [
				//{ title: '', atPlace: '', placeLink: '', placeLogo: '', startDate: moment('2006-09-01'), endDate: moment('2008-09-01'), desc: '' }					
			],
			projects: [
				//{ title: '', startDate: moment('2006-09-01'), endDate: moment('2009-09-01') },
			],
			languages: [],
			skills: [],
			activities: [],
			communication: []
		}
	}
}