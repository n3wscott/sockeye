package controller

type injectionPayload struct {
	Data        string `json:"data"`
	Destination string `json:"destination"`
	Headers     struct {
		CeID          string `json:"Ce-Id"`
		CeSpecversion string `json:"Ce-Specversion"`
		CeType        string `json:"Ce-Type"`
		CeSource      string `json:"Ce-Source"`
		ContentType   string `json:"Content-Type"`
	} `json:"headers"`
}
