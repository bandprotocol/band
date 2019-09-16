package stat

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"

	"github.com/bandprotocol/band/go/reqmsg"
	"github.com/ethereum/go-ethereum/common"
	_ "github.com/lib/pq"
)

type Summary struct {
	Reports    []reqmsg.DataResponse `json:"reports"`
	DataSet    common.Address        `json:"dataset"`
	Agreements []reqmsg.SignResponse `json:"agreements"`
	Conclusion struct {
		Value      common.Hash `json:"value"`
		Timestamp  uint64      `json:"timestamp"`
		Status     string      `json:"status"`
		Submission string      `json:"submission"`
	} `json:"conclusion"`
}

var summaryDB *sql.DB

func createTables() (err error) {
	qry := `
create table if not exists Summary (
		id                              serial primary key,
		key             varchar not null,
		dataset                 varchar not null,
		timestamp               bigint not null,
		detail                  json not null
)`

	_, err = summaryDB.Exec(qry)
	if err != nil {
		return err
	}

	return nil
}

func InitDb(dbParam string) {
	var err error
	psqlInfo := dbParam

	summaryDB, err = sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	err = summaryDB.Ping()
	if err != nil {
		panic(err)
	}

	err = createTables()
	if err != nil {
		panic(err)
	}

	log.Println("database is connected")
}

func SaveRequestToDB(key string, dataset common.Address, timestamp uint64, detail Summary) {
	if summaryDB == nil {
		return
	}
	bytes, err := json.Marshal(detail)
	if err != nil {
		log.Println(err.Error())
	}

	_, err = summaryDB.Exec(
		fmt.Sprintf(
			"insert into summary(key,dataset,timestamp,detail) values('%s','%s','%d','%s')",
			key,
			dataset.Hex(),
			timestamp,
			string(bytes),
		),
	)
	if err != nil {
		log.Println(err.Error())
	}
}
