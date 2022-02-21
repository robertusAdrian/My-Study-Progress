import React, { useState, useEffect, useCallback } from "react";
import { Form, Row, Col, Container } from "react-bootstrap";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Image from "next/image";

//headercontent
import DownloadIcon from "@/public/images/icons24px/download.png";
import PrintIcon from "@/public/images/icons24px/Print.png";
import FilterIcon from "@/public/images/icons24px/Filter.png";
import { IoMdMore } from "react-icons/io";
import RightCanvas from "@/components/atoms/drawer_canvas";
import {
  fg_formatRupiah,
  fg_alignLeft,
  fg_alignCenter,
  fg_alignRight,
  pg_exportToExcel,
} from "@/global-utils/global_functions";
import NumberFormat from "react-number-format";

import moment from "moment";
moment().format();

import _ from "lodash";

//Component
import EcsSelect from "@/components/atoms/form/input_select";
import SelectDate from "@/eces_modules/ecs_9306_list_tunggakan/component/select_date";

//content
import MainTableRekapTunggakan from "@/eces_modules/ecs_9306_list_tunggakan/component/table_rekap_tunggakan";

import {
  SetRekapTunggakanTahun,
  SetRekapTunggakanBulan,
} from "@/components/organisms/eces_modules/ecs_9306_list_tunggakan/services/api_rekap_tunggakan";
import { SetUmurTunggakanResume } from "@/components/organisms/eces_modules/ecs_9306_list_tunggakan/services/api_umur_tunggakan";

export default function MainListTunggakan() {
  const [isSwitchOnKPR, setIsSwitchOnKPR] = useState(false);
  const [isSwitchOnPeriode, setIsSwitchOnPeriode] = useState(true);

  const onSwitchKPR = () => {
    setIsSwitchOnKPR(!isSwitchOnKPR);
    if (!isSwitchOnKPR) {
      setDataKPR("1");
    } else {
      setDataKPR("0");
    }
  };
  const [isEnabledPeriode, setEnabledPeriode] = useState(true);
  const onSwitchPeriode = () => {
    setIsSwitchOnPeriode(!isSwitchOnPeriode);
    if (!isSwitchOnPeriode) {
      setDataPeriode("1");
      setEnabledPeriode(true);
    } else {
      setDataPeriode("0");
      setEnabledPeriode(false);
    }
  };

  //data filter
  const [dataProyek, setDataProyek] = useState("211");
  const [dataKPR, setDataKPR] = useState("0");
  const [dataPeriode, setDataPeriode] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const threeMonth: Date = new Date(
    new Date().setMonth(new Date().getMonth() - 2),
  );
  const start: any = moment(threeMonth).format("yyyy-MM-DD");
  const end: any = moment().format("yyyy-MM-DD");

  const setStart: any =
    startDate === "" ? start : moment(startDate).format("yyyy-MM-DD");
  const setEnd: any =
    endDate === "" ? end : moment(endDate).format("yyyy-MM-DD");

  //tabs
  const [tabKey, setTabKey] = useState("tab_rekaptunggakan");
  const [showCanvas, setShowCanvas] = useState({ setShow: false, title: "" });
  const p_onCloseCanvas = () => {
    setShowCanvas({ setShow: false, title: "" });
  };

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const p_viewData = () => {
    if (tabKey == "tab_rekaptunggakan") {
      f_dataRekapTunggakan();
    } else if (tabKey == "tab_umurtunggakan") {
      f_dataUmurTunggakan();
    }
  };

  //MainTableRekapTunggakan
  const [dataRekapTunggakan, setDataRekapTunggakan] = useState([]);

  const vl_tunggakanColumns: any[] = [
    {
      Header: "NO",
      accessor: "prj_id",
      id: "prj_id",
      width: 50,
      Footer: "Total",
      sticky: "left",
      Cell: (props: any) => {
        return <div>{props.row.index + 1}</div>;
      },
    },
    {
      Header: "TAHUN",
      accessor: "tahun",
      id: "tahun",
      minWidth: 150,
      maxWidth: 200,
      sticky: "left",
    },
    {
      Header: "JANUARI",
      accessor: "januari",
      id: "januari",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["januari"][0];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "FEBRUARI",
      accessor: "februari",
      id: "februari",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["februari"][1];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "MARET",
      accessor: "maret",
      id: "maret",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["maret"][2];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "APRIL",
      accessor: "april",
      id: "april",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["april"][3];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "MEI",
      accessor: "mei",
      id: "mei",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["mei"][4];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "JUNI",
      accessor: "juni",
      id: "juni",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["juni"][5];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "JULI",
      accessor: "juli",
      id: "juli",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["juli"][6];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "AGUSTUS",
      accessor: "agustus",
      id: "agustus",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["agustus"][7];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "SEPTEMBER",
      accessor: "september",
      id: "september",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["september"][8];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "OKTOBER",
      accessor: "oktober",
      id: "oktober",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["oktober"][9];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "NOVEMBER",
      accessor: "november",
      id: "november",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["november"][10];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "DESEMBER",
      accessor: "desember",
      id: "desember",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["desember"][11];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
    {
      Header: "Total",
      accessor: "total",
      id: "total",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          <NumberFormat
            value={_.sum(
              _.map(dataRekapTunggakan, (item: any) => {
                return item["total"];
              }),
            )}
            prefix="Rp. "
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
          />
        </>
      ),
    },
  ];

  const f_dataRekapTunggakan = useCallback(async () => {
    setLoading(true);
    const dataRekapTunggakan = {
      userId: 0,
      prjId: dataProyek,
      isKpr: dataKPR,
    };
    const response = await SetRekapTunggakanBulan(dataRekapTunggakan);

    const responseTahun = await SetRekapTunggakanTahun(dataRekapTunggakan);

    if (response?.error === true) {
      f_dataColumnRekapTunggakan(response?.data, responseTahun?.data);
    } else if (response?.error === false) {
      setDataRekapTunggakan([]);
      setMessage(response?.message);
    }
    setLoading(false);
  }, [dataProyek, dataKPR]);

  const f_dataColumnRekapTunggakan = (item: any[], dataTahun: any[]) => {
    const dataArr: any = item;
    const resultData: any = [];

    const tahun: any = [];

    const yearArr: any = dataTahun;
    if (yearArr !== undefined && dataArr !== undefined) {
      if (yearArr.length > 0 && dataArr.length > 0) {
        //create year
        Object.keys(yearArr[0]).map((key) => {
          const result = yearArr[0][key];

          if (key === "periode") {
            const year = result;

            Object.keys(year).map((period) => {
              const dataTahun = period.toString();
              tahun.push(dataTahun);

              //create tunggakan
              Object.values(dataArr).map((dataResult: any) => {
                //split month
                let numberPeriode = [
                  "-01",
                  "-02",
                  "-03",
                  "-04",
                  "-05",
                  "-06",
                  "-07",
                  "-08",
                  "-09",
                  "-10",
                  "-11",
                  "-12",
                ];

                const januariArr = numberPeriode.map((item) => {
                  if (item === "-01") {
                    const januari =
                      dataResult[key][dataTahun + "-01"] !== undefined
                        ? dataResult[key][dataTahun + "-01"]["nom_tunggakan"]
                        : "0";

                    return januari;
                  }
                });

                const februariArr = numberPeriode.map((item) => {
                  if (item === "-02") {
                    const februari =
                      dataResult[key][dataTahun + "-02"] !== undefined
                        ? dataResult[key][dataTahun + "-02"]["nom_tunggakan"]
                        : "0";

                    return februari;
                  }
                });

                const maretArr = numberPeriode.map((item) => {
                  if (item === "-03") {
                    const maret =
                      dataResult[key][dataTahun + "-03"] !== undefined
                        ? dataResult[key][dataTahun + "-03"]["nom_tunggakan"]
                        : "0";

                    return maret;
                  }
                });

                const aprilArr = numberPeriode.map((item) => {
                  if (item === "-04") {
                    const april =
                      dataResult[key][dataTahun + "-04"] !== undefined
                        ? dataResult[key][dataTahun + "-04"]["nom_tunggakan"]
                        : "0";

                    return april;
                  }
                });

                const meiArr = numberPeriode.map((item) => {
                  if (item === "-05") {
                    const mei =
                      dataResult[key][dataTahun + "-05"] !== undefined
                        ? dataResult[key][dataTahun + "-05"]["nom_tunggakan"]
                        : "0";

                    return mei;
                  }
                });

                const juniArr = numberPeriode.map((item) => {
                  if (item === "-06") {
                    const juni =
                      dataResult[key][dataTahun + "-06"] !== undefined
                        ? dataResult[key][dataTahun + "-06"]["nom_tunggakan"]
                        : "0";

                    return juni;
                  }
                });

                const juliArr = numberPeriode.map((item) => {
                  if (item === "-07") {
                    const juli =
                      dataResult[key][dataTahun + "-07"] !== undefined
                        ? dataResult[key][dataTahun + "-07"]["nom_tunggakan"]
                        : "0";

                    return juli;
                  }
                });

                const agustusArr = numberPeriode.map((item) => {
                  if (item === "-08") {
                    const agustus =
                      dataResult[key][dataTahun + "-08"] !== undefined
                        ? dataResult[key][dataTahun + "-08"]["nom_tunggakan"]
                        : "0";

                    return agustus;
                  }
                });

                const septemberArr = numberPeriode.map((item) => {
                  if (item === "-09") {
                    const september =
                      dataResult[key][dataTahun + "-09"] !== undefined
                        ? dataResult[key][dataTahun + "-09"]["nom_tunggakan"]
                        : "0";

                    return september;
                  }
                });

                const oktoberArr = numberPeriode.map((item) => {
                  if (item === "-10") {
                    const oktober =
                      dataResult[key][dataTahun + "-10"] !== undefined
                        ? dataResult[key][dataTahun + "-10"]["nom_tunggakan"]
                        : "0";

                    return oktober;
                  }
                });

                const novemberArr = numberPeriode.map((item) => {
                  if (item === "-11") {
                    const november =
                      dataResult[key][dataTahun + "-11"] !== undefined
                        ? dataResult[key][dataTahun + "-11"]["nom_tunggakan"]
                        : "0";

                    return november;
                  }
                });

                const desemberArr = numberPeriode.map((item) => {
                  if (item === "-12") {
                    const desember =
                      dataResult[key][dataTahun + "-12"] !== undefined
                        ? dataResult[key][dataTahun + "-12"]["nom_tunggakan"]
                        : "0";

                    return desember;
                  }
                });
                //set Total
                const totalData =
                  Number(januariArr[0]) +
                  Number(februariArr[1]) +
                  Number(maretArr[2]) +
                  Number(aprilArr[3]) +
                  Number(meiArr[4]) +
                  Number(juniArr[5]) +
                  Number(juliArr[6]) +
                  Number(agustusArr[7]) +
                  Number(septemberArr[8]) +
                  Number(oktoberArr[9]) +
                  Number(novemberArr[10]) +
                  Number(desemberArr[11]);

                resultData.push({
                  tahun: dataTahun,
                  januari: januariArr,
                  februari: februariArr,
                  maret: maretArr,
                  april: aprilArr,
                  mei: meiArr,
                  juni: juniArr,
                  juli: juliArr,
                  agustus: agustusArr,
                  september: septemberArr,
                  oktober: oktoberArr,
                  november: novemberArr,
                  desember: desemberArr,
                  total: totalData,
                });
              });
            });
          }
        });
        setDataRekapTunggakan(resultData);
      }
    }
  };

  //MainTableUmurTunggakan
  const [grouprangeone, setGrouprangeone] = useState([]);
  const [grouprangetwo, setGrouprangetwo] = useState([]);
  const [grouprangethree, setGrouprangethree] = useState([]);
  const [grouprangefour, setGrouprangefour] = useState([]);
  const [grouprangefive, setGrouprangefive] = useState([]);
  const [dataUmurTunggakan, setDataUmurTunggakan] = useState([]);
  const [filterDataUmur, setFilterDataUmur] = useState([]);

  const vl_umurTunggakanColumns: any[] = [
    {
      Header: "NO",
      accessor: "arkon_id",
      id: "arkon_id",
      width: 50,
      Footer: "Total",
      sticky: "left",
      Cell: (props: any) => {
        return <div>{props.row.index + 1}</div>;
      },
    },
    {
      Header: "CLUSTER",
      accessor: "sprop_cluster",
      id: "sprop_cluster",
      minWidth: 150,
      maxWidth: 200,
      sticky: "left",
    },
    {
      Header: "TYPE",
      accessor: "sprop_type",
      id: "sprop_type",
      minWidth: 150,
      maxWidth: 200,
      sticky: "left",
    },
    {
      Header: "UNIT",
      accessor: "sprop_blok",
      id: "sprop_blok",
      minWidth: 150,
      maxWidth: 200,
      sticky: "left",
    },
    {
      Header: "KONSUMEN",
      accessor: "cus_nm",
      id: "cus_nm",
      minWidth: 150,
      maxWidth: 200,
      sticky: "left",
    },
    {
      Header: "< 1 BULAN",
      accessor: "grouprangeone",
      id: "grouprangeone",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          {_.sum(
            _.map(grouprangeone, (item: any) => {
              return item;
            }),
          )}
        </>
      ),
    },
    {
      Header: "1 S.D 3 BULAN",
      accessor: "grouprangetwo",
      id: "grouprangetwo",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          {_.sum(
            _.map(grouprangetwo, (item: any) => {
              return item;
            }),
          )}
        </>
      ),
    },
    {
      Header: "4 S.D 6 BULAN",
      accessor: "grouprangethree",
      id: "grouprangethree",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          {_.sum(
            _.map(grouprangethree, (item: any) => {
              return item;
            }),
          )}
        </>
      ),
    },
    {
      Header: "7 S.D 12 BULAN",
      accessor: "grouprangefour",
      id: "grouprangefour",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          {_.sum(
            _.map(grouprangefour, (item: any) => {
              return item;
            }),
          )}
        </>
      ),
    },
    {
      Header: "12 BULAN <",
      accessor: "grouprangefive",
      id: "grouprangefive",
      minWidth: 150,
      maxWidth: 200,
      Footer: (
        <>
          {_.sum(
            _.map(grouprangefive, (item: any) => {
              return item;
            }),
          )}
        </>
      ),
    },
  ];

  const f_dataUmurTunggakan = useCallback(async () => {
    setLoading(true);
    const dataUmurTunggakan = {
      prjId: dataProyek,
      isKpr: dataKPR,
      isPeriode: dataPeriode,
      tanggalAwal: setStart,
      tanggalAkhir: setEnd,
    };
    const response = await SetUmurTunggakanResume(dataUmurTunggakan);

    if (response?.error === true) {
      setFilterDataUmur(response?.data.umurTunggakan_resume);
      f_dataColumnUmurTunggakan(response?.data.umurTunggakan_resume);
      setDataUmurTunggakan(response?.data.umurTunggakan_resume);
    } else if (response?.error === false) {
      setDataUmurTunggakan([]);
      setFilterDataUmur([]);
      setMessage(response?.message);
    }
    setLoading(false);
  }, [dataProyek, dataPeriode, dataKPR, startDate, endDate]);

  const f_dataColumnUmurTunggakan = (item: any[]) => {
    const dataArr: any = item;

    const resultData: any = [];

    if (dataArr !== undefined) {
      if (dataArr.length > 0) {
        Object.values(dataArr).map((data: any) => {
          //data table
          const clusterData: any = data["sprop_cluster"];
          const typeData: any = data["sprop_type"];
          const unitData: any = data["sprop_blok"];
          const konsumenData: any = data["cus_nm"];

          //group range
          const grouprangeone: any = []; //0-30 days
          const grouprangetwo: any = []; //31-90 days
          const grouprangethree: any = []; //91-180 days
          const grouprangefour: any = []; //181-360 days
          const grouprangefive: any = []; //361++ days

          if (
            0 < data["umur_tunggakan_hari"] &&
            30 > data["umur_tunggakan_hari"]
          ) {
            //return
            grouprangeone.push(data["nom_tunggakan"]);
            grouprangetwo.push("0");
            grouprangethree.push("0");
            grouprangefour.push("0");
            grouprangefive.push("0");
            setGrouprangeone(data["nom_tunggakan"]);
          } else if (
            31 < data["umur_tunggakan_hari"] &&
            90 > data["umur_tunggakan_hari"]
          ) {
            //return
            grouprangeone.push("0");
            grouprangetwo.push(data["nom_tunggakan"]);
            grouprangethree.push("0");
            grouprangefour.push("0");
            grouprangefive.push("0");
            setGrouprangetwo(data["nom_tunggakan"]);
          } else if (
            91 < data["umur_tunggakan_hari"] &&
            180 > data["umur_tunggakan_hari"]
          ) {
            //return
            grouprangeone.push("0");
            grouprangetwo.push("0");
            grouprangethree.push(data["nom_tunggakan"]);
            grouprangefour.push("0");
            grouprangefive.push("0");
            setGrouprangethree(data["nom_tunggakan"]);
          } else if (
            181 < data["umur_tunggakan_hari"] &&
            360 > data["umur_tunggakan_hari"]
          ) {
            //return
            grouprangeone.push("0");
            grouprangetwo.push("0");
            grouprangethree.push("0");
            grouprangefour.push(data["nom_tunggakan"]);
            grouprangefive.push("0");
            setGrouprangefour(data["nom_tunggakan"]);
          } else if (361 < data["umur_tunggakan_hari"]) {
            //return
            grouprangeone.push("0");
            grouprangetwo.push("0");
            grouprangethree.push("0");
            grouprangefour.push("0");
            grouprangefive.push(data["nom_tunggakan"]);
            setGrouprangefive(data["nom_tunggakan"]);
          } else {
            grouprangeone.push("0");
            grouprangetwo.push("0");
            grouprangethree.push("0");
            grouprangefour.push("0");
            grouprangefive.push("0");
          }

          resultData.push({
            sprop_cluster: clusterData,
            sprop_type: typeData,
            sprop_blok: unitData,
            cus_nm: konsumenData,
            grouprangeone: grouprangeone,
            grouprangetwo: grouprangetwo,
            grouprangethree: grouprangethree,
            grouprangefour: grouprangefour,
            grouprangefive: grouprangefive,
          });
        });
      }
    }

    setFilterDataUmur(resultData);
  };

  useEffect(() => {
    p_viewData();
  }, [dataProyek, dataPeriode, dataKPR, startDate, endDate]);

  const p_searchKey = (key: any) => {
    var q = key.target.value;
    if (tabKey == "tab_rekaptunggakan") {
      setDataRekapTunggakan([]);
    } else if (tabKey == "tab_umurtunggakan") {
      const result = dataUmurTunggakan.filter(
        (items: any) =>
          items.sprop_cluster.toLowerCase().includes(q.toLowerCase()) ||
          items.sprop_type.toLowerCase().includes(q.toLowerCase()) ||
          items.cus_nm.toLowerCase().includes(q.toLowerCase()) ||
          items.sprop_blok.toLowerCase().includes(q.toLowerCase()),
      );

      if (q != "") {
        setFilterDataUmur(result);
        f_dataColumnUmurTunggakan(result);
      } else {
        setFilterDataUmur(dataUmurTunggakan);
        f_dataColumnUmurTunggakan(dataUmurTunggakan);
      }
    }
  };

  const p_viewFilter = () => {
    return (
      <>
        <div className="position-relative" style={{ height: "95%" }}>
          <Form>
            <Container>
              <Row style={{ height: "485px", overflowY: "auto" }}>
                <Col>
                  <Form.Group className="mb-3">
                    {tabKey === "tab_rekaptunggakan" ? (
                      <></>
                    ) : tabKey === "tab_umurtunggakan" ? (
                      <>
                        <Form.Switch
                          id="custom-switch"
                          label="Periode Penjualan"
                          checked={isSwitchOnPeriode}
                          onChange={onSwitchPeriode}
                        />
                        <SelectDate
                          startDate={setStartDate}
                          endDate={setEndDate}
                          isEnabled={isEnabledPeriode}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Container>
          </Form>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-2">
        <div className="col-lg-8 col-md-8 col-sm-4"></div>
        <div className="col-lg-4 col-md-4 col-sm-8 text-end">
          <input
            type="text"
            className="rounded-pill border-1 px-2 pt-1 pb-1 search-input"
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="basic-addon2"
            style={{
              fontSize: "10px",
              borderColor: "#A6A6A6",
              backgroundColor: "#F5F5F5",
            }}
            onChange={(e) => p_searchKey(e)}
          />

          <a
            type="button"
            className="no-after pX-10"
            onClick={() =>
              tabKey == "tab_rekaptunggakan"
                ? pg_exportToExcel({
                    filename: "rekap_tunggakan",
                    colums: vl_tunggakanColumns,
                    rows: dataRekapTunggakan,
                  })
                : tabKey == "tab_umurtunggakan"
                ? pg_exportToExcel({
                    filename: "umur_tunggakan",
                    colums: vl_umurTunggakanColumns,
                    rows: filterDataUmur,
                  })
                : null
            }
          >
            <span className="icon-holder">
              <Image src={DownloadIcon} alt="" height={14} width={14} />
            </span>
          </a>
          <a type="button" className="no-after pX-10">
            <span className="icon-holder">
              <Image src={PrintIcon} alt="" height={14} width={14} />
            </span>
          </a>
          <a
            type="button"
            className="no-after pX-10"
            onClick={() =>
              setShowCanvas({
                setShow: true,
                title:
                  tabKey == "tab_rekaptunggakan"
                    ? "FILTER DATA REKAP TUNGGAKAN"
                    : tabKey == "tab_umurtunggakan"
                    ? "FILTER DATA UMUR TUNGGAKAN"
                    : "",
              })
            }
          >
            <span className="icon-holder">
              <Image src={FilterIcon} alt="" height={14} width={14} />{" "}
            </span>
          </a>
          <a type="button" className="no-after pe-1">
            <span className="icon-holder">
              <IoMdMore
                style={{ color: "#A6A6A6", fontSize: "18", marginBottom: "8" }}
              />
            </span>
          </a>
        </div>
      </Row>

      {/* Content */}
      <div className="bg-white p-2">
        <Row className="mb-1">
          <div className="col-lg-4 col-md-6 col-sm-12">
            <Form.Switch
              id="custom-switch"
              label="Tagihan KPR"
              checked={isSwitchOnKPR}
              onChange={onSwitchKPR}
            />
            <EcsSelect setData={setDataProyek} data={dataProyek} />
          </div>
        </Row>
        <Tabs
          id="mytabs"
          activeKey={tabKey}
          onSelect={(k) => setTabKey(`${k}`)}
          className="mb-3"
          style={{ fontSize: "10px", backgroundColor: "white" }}
        >
          <Tab
            eventKey="tab_rekaptunggakan"
            title="REKAP TUNGGAKAN"
            className="pt-1"
          >
            <Row>
              <div className={"col-12"}>
                <MainTableRekapTunggakan
                  data={dataRekapTunggakan}
                  columns={vl_tunggakanColumns}
                  loading={loading}
                  message={message}
                />
              </div>
            </Row>
          </Tab>
          <Tab eventKey="tab_umurtunggakan" title="UMUR TUNGGAKAN">
            <Row>
              <div className={"col-12"}>
                <MainTableRekapTunggakan
                  data={filterDataUmur}
                  columns={vl_umurTunggakanColumns}
                  loading={loading}
                  message={message}
                />
              </div>
            </Row>
          </Tab>
        </Tabs>
      </div>
      <RightCanvas
        vg_isOpen={showCanvas.setShow}
        vg_title={
          tabKey == "tab_rekaptunggakan"
            ? "FILTER DATA REKAP TUNGGAKAN"
            : tabKey == "tab_umurtunggakan"
            ? "FILTER DATA UMUR TUNGGAKAN"
            : ""
        }
        vg_type={"end"}
        vg_onClose={p_onCloseCanvas}
      >
        {p_viewFilter()}
      </RightCanvas>
    </>
  );
}
