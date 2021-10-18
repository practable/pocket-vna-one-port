package stream

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"reflect"
	"strings"
	"testing"
	"time"

	"../pocket"
	"../reconws"
	"github.com/gorilla/websocket"
	"github.com/stretchr/testify/assert"
)

var upgrader = websocket.Upgrader{}

func TestRun(t *testing.T) {

	// Create test server with the echo handler.
	s := httptest.NewServer(http.HandlerFunc(reasonableRange))
	defer s.Close()

	// Convert http://127.0.0.1 to ws://127.0.0.
	u := "ws" + strings.TrimPrefix(s.URL, "http")

	ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
	defer cancel()
	go Run(u, ctx)

	time.Sleep(2 * time.Second)

}

// TODO test the pipe functions

func TestPipeInterfaceToWs(t *testing.T) {
	timeout := 100 * time.Millisecond

	chanWs := make(chan reconws.WsMessage)
	chanInterface := make(chan interface{})
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go PipeInterfaceToWs(chanInterface, chanWs, ctx)

	/* Test ReasonableFrequencyRange */

	chanInterface <- pocket.ReasonableFrequencyRange{
		Command: pocket.Command{Command: "rr"}, Result: pocket.Range{Start: 100000, End: 4000000}}

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanWs:

		expected := "{\"id\":\"\",\"t\":0,\"cmd\":\"rr\",\"range\":{\"Start\":100000,\"End\":4000000}}"

		assert.Equal(t, expected, string(reply.Data))
	}

	/* Test SingleQuery */
	chanInterface <- pocket.SingleQuery{
		Command: pocket.Command{Command: "sq"},
		Freq:    100000,
		Avg:     1,
		Select:  pocket.SParamSelect{S11: true, S12: false, S21: true, S22: false},
		Result: pocket.SParam{
			S11: pocket.Complex{Real: -1, Imag: 2},
			S21: pocket.Complex{Real: 0.34, Imag: 0.12},
		},
	}

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanWs:

		expected := "{\"id\":\"\",\"t\":0,\"cmd\":\"sq\",\"freq\":100000,\"avg\":1,\"sparam\":{\"S11\":true,\"S12\":false,\"S21\":true,\"S22\":false},\"result\":{\"S11\":{\"Real\":-1,\"Imag\":2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.34,\"Imag\":0.12},\"S22\":{\"Real\":0,\"Imag\":0}}}"

		assert.Equal(t, expected, string(reply.Data))
	}

	/* Test RangeQuery */
	chanInterface <- pocket.RangeQuery{
		Command:         pocket.Command{Command: "rq"},
		Range:           pocket.Range{Start: 100000, End: 4000000},
		LogDistribution: true,
		Avg:             1,
		Size:            2,
		Select:          pocket.SParamSelect{S11: true, S12: false, S21: true, S22: false},
		Result: []pocket.SParam{
			pocket.SParam{
				S11: pocket.Complex{Real: -1, Imag: 2},
				S21: pocket.Complex{Real: 0.34, Imag: 0.12},
			},
			pocket.SParam{
				S11: pocket.Complex{Real: -0.1, Imag: 0.2},
				S21: pocket.Complex{Real: 0.3, Imag: 0.4},
			},
		},
	}

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanWs:

		expected := "{\"id\":\"\",\"t\":0,\"cmd\":\"rq\",\"range\":{\"Start\":100000,\"End\":4000000},\"size\":2,\"isLog\":true,\"avg\":1,\"sparam\":{\"S11\":true,\"S12\":false,\"S21\":true,\"S22\":false},\"result\":[{\"S11\":{\"Real\":-1,\"Imag\":2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.34,\"Imag\":0.12},\"S22\":{\"Real\":0,\"Imag\":0}},{\"S11\":{\"Real\":-0.1,\"Imag\":0.2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.3,\"Imag\":0.4},\"S22\":{\"Real\":0,\"Imag\":0}}]}"

		assert.Equal(t, expected, string(reply.Data))
	}

}

func TestPipeWsToInterface(t *testing.T) {
	timeout := 100 * time.Millisecond

	chanWs := make(chan reconws.WsMessage)
	chanInterface := make(chan interface{})
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go PipeWsToInterface(chanWs, chanInterface, ctx)

	mt := int(websocket.TextMessage)

	/* Test ReasonableFrequencyRange */
	message := []byte("{\"cmd\":\"rr\"}")

	ws := reconws.WsMessage{
		Data: message,
		Type: mt,
	}

	chanWs <- ws

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanInterface:
		assert.Equal(t, reflect.TypeOf(reply), reflect.TypeOf(pocket.ReasonableFrequencyRange{}))
		rr := reply.(pocket.ReasonableFrequencyRange)
		assert.Equal(t, "rr", rr.Command.Command)
	}

	/* Test SingleQuery */
	message = []byte("{\"id\":\"\",\"t\":0,\"cmd\":\"sq\",\"freq\":100000,\"avg\":1,\"sparam\":{\"S11\":true,\"S12\":false,\"S21\":true,\"S22\":false},\"result\":{\"S11\":{\"Real\":-1,\"Imag\":2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.34,\"Imag\":0.12},\"S22\":{\"Real\":0,\"Imag\":0}}}")

	ws = reconws.WsMessage{
		Data: message,
		Type: mt,
	}

	chanWs <- ws

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanInterface:
		assert.Equal(t, reflect.TypeOf(reply), reflect.TypeOf(pocket.SingleQuery{}))
		sq := reply.(pocket.SingleQuery)
		assert.Equal(t, "sq", sq.Command.Command)
		assert.Equal(t, uint64(100000), sq.Freq)
		assert.Equal(t, uint16(1), sq.Avg)
		assert.Equal(t, pocket.SParamSelect{S11: true, S12: false, S21: true, S22: false}, sq.Select)
		// no need to check the Sparam results because we are not expecting to pass them in this direction
	}

	/* Test RangeQuery */
	message = []byte("{\"id\":\"\",\"t\":0,\"cmd\":\"rq\",\"range\":{\"Start\":100000,\"End\":4000000},\"size\":2,\"isLog\":true,\"avg\":1,\"sparam\":{\"S11\":true,\"S12\":false,\"S21\":true,\"S22\":false},\"result\":[{\"S11\":{\"Real\":-1,\"Imag\":2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.34,\"Imag\":0.12},\"S22\":{\"Real\":0,\"Imag\":0}},{\"S11\":{\"Real\":-0.1,\"Imag\":0.2},\"S12\":{\"Real\":0,\"Imag\":0},\"S21\":{\"Real\":0.3,\"Imag\":0.4},\"S22\":{\"Real\":0,\"Imag\":0}}]}")

	ws = reconws.WsMessage{
		Data: message,
		Type: mt,
	}

	chanWs <- ws

	select {

	case <-time.After(timeout):
		t.Error("timeout awaiting response")
	case reply := <-chanInterface:
		assert.Equal(t, reflect.TypeOf(reply), reflect.TypeOf(pocket.RangeQuery{}))
		rq := reply.(pocket.RangeQuery)
		assert.Equal(t, "rq", rq.Command.Command)
		assert.Equal(t, pocket.Range{Start: 100000, End: 4000000}, rq.Range)
		assert.Equal(t, uint16(1), rq.Avg)
		assert.Equal(t, pocket.SParamSelect{S11: true, S12: false, S21: true, S22: false}, rq.Select)
		assert.Equal(t, true, rq.LogDistribution)
		// no need to check the Sparam results because we are not expecting to pass them in this direction
	}

}

func reasonableRange(w http.ResponseWriter, r *http.Request) {
	c, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	defer c.Close()

	mt := int(websocket.TextMessage)

	message := []byte("{\"cmd\":\"rr\"}")

	for {

		err = c.WriteMessage(mt, message)
		if err != nil {
			break
		}
		_, message, err := c.ReadMessage()
		if err != nil {
			break
		}

		fmt.Println("Hello!")
		fmt.Println(message)

	}
}