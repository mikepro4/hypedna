import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

class Header extends Component {
	render() {
		return (
			<header className="app-header">
				<div className="header-left">
					<div className="app-menu">
						<IconButton aria-label="Menu">
							<MenuIcon />
						</IconButton>
					</div>
					<div className="app-logo">
						<svg
							width="106"
							height="27"
							viewBox="0 0 106 27"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M6.32356415,4.00904377 C10.4065638,2.80020201 14.6273516,2.17263618 18.9859274,2.12634628 C23.3405688,2.08009816 27.5241642,2.68795107 31.5367135,3.94990501 C33.4748574,4.55945871 34.8990355,6.23788314 35.2036825,8.27151155 C35.5026412,10.2671689 35.6371897,12.412767 35.6073281,14.7083058 C35.578853,16.8972548 35.4355675,18.9849549 35.1774714,20.9714061 C34.8814498,23.2497138 33.187733,25.0844277 30.9646314,25.5349471 C27.2416284,26.2894268 23.2487271,26.6666667 18.9859274,26.6666667 C14.662575,26.6666667 10.5861956,26.2786334 6.75678897,25.5025668 C4.5777283,25.0609581 2.90231445,23.2875628 2.56135484,21.0617747 C2.22159689,18.843831 2.06362099,16.6216662 2.08742712,14.3952802 C2.11046309,12.2409215 2.27481788,10.2097804 2.58049149,8.30185705 C2.90773547,6.25931227 4.36395366,4.58921991 6.32356415,4.00904377 Z M17.1622179,20.8440709 L22.4960511,14.2431623 C23.2749528,13.3008859 22.6124831,11.8534675 21.3741694,11.7377829 L19.9093955,11.7359357 L21.03626,8.77145156 C21.4283774,7.5656776 19.9228042,6.58851468 19.0756872,7.63314387 L14.2080711,13.5105666 C13.5186529,14.4976624 14.0969087,15.8346889 15.2748601,15.8346889 L17.0179967,15.8346889 L15.4254826,19.8515963 L15.392921,19.9539495 C15.2856768,20.3947797 15.4732365,20.8445117 15.8256775,21.0859647 C16.2566849,21.3812426 16.8317905,21.2968145 17.1622179,20.8440709 Z"
								id="Combined-Shape"
								fill="#FAFF00"
							/>
							<path
								d="M5.23301232,3.32753804 C3.52864552,3.82389105 2.2612257,5.27465818 1.98124707,7.04970788 C1.69966935,8.83491614 1.54778588,10.735607 1.5260356,12.7518081 C1.50354864,14.8362965 1.6491868,16.916954 1.9630185,18.9941921 C2.25477827,20.9253371 3.70999197,22.4635546 5.60116784,22.8398563 C9.29291055,23.5744348 13.2242597,23.9420756 17.3955969,23.9420756 C21.5056383,23.9420756 25.3536874,23.5851599 28.940023,22.8721409 C30.869295,22.4885718 32.3405523,20.897518 32.5935442,18.9211322 C32.8324371,17.0548999 32.9654829,15.0940063 32.9924603,13.0384529 C33.0206647,10.8894098 32.8972747,8.88122405 32.6229165,7.01394293 C32.3630088,5.24501224 31.1221128,3.78559244 29.4345152,3.26405773 C25.588505,2.07549288 21.5790777,1.50304514 17.4035085,1.5470008 C13.2136573,1.59110679 9.15744543,2.18464779 5.23301232,3.32753804 Z M4.81226541,1.84293933 C8.86925127,0.661446506 13.0616781,0.0479733272 17.3876854,0.00243403398 C21.7176961,-0.043147402 25.8823321,0.551460337 29.8788694,1.78654379 C32.1289999,2.48192351 33.7835275,4.42781612 34.130071,6.78639033 C34.4168977,8.7385321 34.5453672,10.8293866 34.5161053,13.059001 C34.4883618,15.1729253 34.3512854,17.193225 34.1046552,19.1199011 C33.7673327,21.7550819 31.8056561,23.8764872 29.2332934,24.3879127 C25.5473989,25.1207255 21.6014072,25.4867257 17.3955969,25.4867257 C13.1281108,25.4867257 9.0986731,25.1099121 5.30766627,24.3555821 C2.7860988,23.8538466 0.845813497,21.8028896 0.456800475,19.2280296 C0.130460166,17.0679975 -0.021047196,14.9034897 0.00234683066,12.7349175 C0.0248967611,10.6445912 0.182827754,8.66822074 0.476578965,6.80583228 C0.849883893,4.43909883 2.53977639,2.50474333 4.81226541,1.84293933 Z"
								id="Mask-Copy-32"
								fill="#000"
								fillRule="nonzero"
							/>
							<path
								d="M21.2257515,12.154811 C21.5984744,11.7111849 21.287872,10.9506831 20.6045468,10.8873079 L18.0576073,10.8873079 L19.6106192,6.83129832 C19.7348601,6.45104742 19.2378963,6.07079652 18.927294,6.45104742 L13.957656,12.4083116 C13.6470536,12.8519376 13.8955355,13.4856891 14.4546198,13.4856891 L17.3742821,13.4856891 L15.3243064,18.6190763 C15.2621859,18.8725769 15.5727883,19.1260775 15.7591497,18.8725769 L21.2257515,12.154811 Z M16.9999639,19.796275 C16.411677,20.5965001 15.3592968,20.7498766 14.5842617,20.2227507 C13.9647374,19.8013927 13.6364227,19.0198524 13.8257564,18.2472216 L13.851728,18.1412369 L15.0906458,15.0388366 L14.4546198,15.0388366 C12.5970883,15.0388366 11.6883454,12.9528679 12.6959232,11.5137682 L12.7755238,11.4097147 L17.7349564,5.46481334 C19.1683878,3.70995367 21.7183571,5.3529887 21.0768408,7.31640852 L21.0508509,7.38970995 L20.3063372,9.33416044 L20.6045468,9.33416044 L20.7461983,9.3407153 C22.608948,9.51347644 23.6167718,11.6967138 22.4139609,13.1461189 L16.9999639,19.796275 Z"
								id="Path-Copy-17"
								fill="#000"
								fillRule="nonzero"
							/>
							<path
								d="M48.4377448,16.8412698 L48.4377448,7.15873016 C48.4377448,7.04761905 48.38645,7 48.2667621,7 L46.6595253,7 C46.5398375,7 46.4885427,7.04761905 46.4885427,7.15873016 L46.4885427,10.9365079 C46.4885427,11.047619 46.4372479,11.0952381 46.3175601,11.0952381 L43.137283,11.0952381 C43.0175951,11.0952381 42.9663003,11.047619 42.9663003,10.9365079 L42.9663003,7.15873016 C42.9663003,7.04761905 42.9150056,7 42.7953177,7 L41.1709826,7 C41.0512948,7 41,7.04761905 41,7.15873016 L41,16.8412698 C41,16.952381 41.0512948,17 41.1709826,17 L42.7953177,17 C42.9150056,17 42.9663003,16.952381 42.9663003,16.8412698 L42.9663003,12.9206349 C42.9663003,12.8095238 43.0175951,12.7619048 43.137283,12.7619048 L46.3175601,12.7619048 C46.4372479,12.7619048 46.4885427,12.8095238 46.4885427,12.9206349 L46.4885427,16.8412698 C46.4885427,16.952381 46.5398375,17 46.6595253,17 L48.2667621,17 C48.38645,17 48.4377448,16.952381 48.4377448,16.8412698 Z M57.8284913,7.12698413 C57.8284913,7.04761905 57.7600982,7 57.6404103,7 L55.7596013,7 C55.6912083,7 55.6399135,7.04761905 55.605717,7.0952381 L53.9813819,10.2063492 C53.9471854,10.2857143 53.8787923,10.3333333 53.8274975,10.3333333 C53.7762027,10.3333333 53.7078097,10.2857143 53.6736131,10.2063492 L52.0492781,7.0952381 C52.0150815,7.04761905 51.9637868,7 51.8953937,7 L49.9974864,7 C49.8777986,7 49.8094055,7.04761905 49.8094055,7.12698413 C49.8094055,7.19047619 49.8607003,7.26984127 49.9290934,7.38095238 L52.7161104,12.2222222 C52.8186999,12.4126984 52.8357982,12.4920635 52.8357982,12.6507937 L52.8357982,16.8412698 C52.8357982,16.952381 52.887093,17 53.0067808,17 L54.6311159,17 C54.7508038,17 54.8020986,16.952381 54.8020986,16.8412698 L54.8020986,12.6666667 C54.8020986,12.4761905 54.8362951,12.3809524 54.9217864,12.2222222 L57.7088034,7.38095238 C57.7600982,7.28571429 57.8284913,7.19047619 57.8284913,7.12698413 Z M66.0565558,9.95238095 C66.0565558,11.5238095 64.8254808,12.7619048 62.8762787,12.7619048 L61.337435,12.7619048 C61.2177471,12.7619048 61.1664523,12.8095238 61.1664523,12.9206349 L61.1664523,16.8412698 C61.1664523,16.952381 61.1151575,17 60.9954697,17 L59.3711346,17 C59.2514468,17 59.200152,16.952381 59.200152,16.8412698 L59.200152,7.15873016 C59.200152,7.04761905 59.2514468,7 59.3711346,7 L62.8762787,7 C64.8254808,7 66.0565558,8.17460317 66.0565558,9.95238095 Z M64.1073537,9.95238095 L64.1073537,9.80952381 C64.1073537,9.19047619 63.543111,8.66666667 62.8762787,8.66666667 L61.337435,8.66666667 C61.2177471,8.66666667 61.1664523,8.71428571 61.1664523,8.82539683 L61.1664523,10.9365079 C61.1664523,11.047619 61.2177471,11.0952381 61.337435,11.0952381 L62.8762787,11.0952381 C63.543111,11.0952381 64.1073537,10.5714286 64.1073537,9.95238095 Z M74.2162273,16.8412698 L74.2162273,15.4920635 C74.2162273,15.3809524 74.1649325,15.3333333 74.0452446,15.3333333 L69.9758578,15.3333333 C69.85617,15.3333333 69.8048752,15.2857143 69.8048752,15.1746032 L69.8048752,12.9206349 C69.8048752,12.8095238 69.85617,12.7619048 69.9758578,12.7619048 L73.3100193,12.7619048 C73.4297071,12.7619048 73.4810019,12.7142857 73.4810019,12.6031746 L73.4810019,11.2539683 C73.4810019,11.1428571 73.4297071,11.0952381 73.3100193,11.0952381 L69.9758578,11.0952381 C69.85617,11.0952381 69.8048752,11.047619 69.8048752,10.9365079 L69.8048752,8.82539683 C69.8048752,8.71428571 69.85617,8.66666667 69.9758578,8.66666667 L74.0452446,8.66666667 C74.1649325,8.66666667 74.2162273,8.61904762 74.2162273,8.50793651 L74.2162273,7.15873016 C74.2162273,7.04761905 74.1649325,7 74.0452446,7 L68.0095575,7 C67.8898696,7 67.8385749,7.04761905 67.8385749,7.15873016 L67.8385749,16.8412698 C67.8385749,16.952381 67.8898696,17 68.0095575,17 L74.0452446,17 C74.1649325,17 74.2162273,16.952381 74.2162273,16.8412698 Z M86.9962296,14.047619 C86.9962296,15.8571429 85.7651546,17 83.8159525,17 L79.9688432,17 C79.8491553,17 79.7978605,16.952381 79.7978605,16.8412698 L79.7978605,7.15873016 C79.7978605,7.04761905 79.8491553,7 79.9688432,7 L83.8159525,7 C85.7651546,7 86.9962296,8.15873016 86.9962296,9.95238095 L86.9962296,14.047619 Z M85.0470275,14.1904762 L85.0470275,9.80952381 C85.0470275,9.19047619 84.4827848,8.66666667 83.8159525,8.66666667 L81.9351435,8.66666667 C81.8154557,8.66666667 81.7641609,8.71428571 81.7641609,8.82539683 L81.7641609,15.1746032 C81.7641609,15.2857143 81.8154557,15.3333333 81.9351435,15.3333333 L83.8159525,15.3333333 C84.4827848,15.3333333 85.0470275,14.8412698 85.0470275,14.1904762 Z M96.3869761,16.8412698 L96.3869761,7.15873016 C96.3869761,7.04761905 96.3356813,7 96.2159935,7 L94.6087567,7 C94.4890688,7 94.437774,7.04761905 94.437774,7.15873016 L94.437774,9.15873016 C94.437774,10.4126984 94.5061671,12.6984127 94.5403636,13.0793651 L94.4719705,13.0952381 C94.4206757,12.968254 94.1813001,12.3968254 94.112907,12.2857143 L91.0523178,7.07936508 C91.0181212,7.03174603 90.9668265,7 90.8984334,7 L89.4621792,7 C89.3424914,7 89.2911966,7.04761905 89.2911966,7.15873016 L89.2911966,16.8412698 C89.2911966,16.952381 89.3424914,17 89.4621792,17 L91.0865143,17 C91.2062021,17 91.2574969,16.952381 91.2574969,16.8412698 L91.2574969,14.8730159 C91.2574969,13.6190476 91.1891039,11.3333333 91.1549074,10.952381 L91.2233004,10.9365079 C91.2745952,11.0634921 91.5139709,11.6349206 91.582364,11.7460317 L94.6429532,16.9206349 C94.6771497,16.968254 94.7284445,17 94.7968376,17 L96.2159935,17 C96.3356813,17 96.3869761,16.952381 96.3869761,16.8412698 Z M106,16.8730159 C106,16.952381 105.931607,17 105.811919,17 L104.084994,17 C103.999503,17 103.93111,16.968254 103.914012,16.8888889 L103.401064,15.2222222 C103.383966,15.1428571 103.315573,15.1269841 103.230081,15.1269841 L100.78503,15.1269841 C100.699538,15.1269841 100.631145,15.1428571 100.614047,15.2222222 L100.101099,16.8888889 C100.084001,16.968254 100.015608,17 99.9301163,17 L98.22029,17 C98.1006021,17 98.032209,16.952381 98.032209,16.8730159 C98.032209,16.8095238 98.0835038,16.7142857 98.1177004,16.5873016 L101.229584,7.11111111 C101.246683,7.03174603 101.315076,7 101.400567,7 L102.631642,7 C102.717133,7 102.785526,7.03174603 102.802625,7.11111111 L105.914509,16.5873016 C105.948705,16.6825397 106,16.8095238 106,16.8730159 Z M102.819723,13.3174603 C102.819723,13.2539683 102.768428,13.1111111 102.734232,13.015873 L102.238382,11.1587302 C102.204185,11.047619 102.084498,10.4126984 102.050301,10.2857143 L101.999006,10.2857143 C101.96481,10.4126984 101.828024,11.031746 101.793827,11.1587302 L101.280879,13 C101.246683,13.1111111 101.195388,13.2539683 101.195388,13.3174603 C101.195388,13.3968254 101.263781,13.4603175 101.383469,13.4603175 L102.631642,13.4603175 C102.75133,13.4603175 102.819723,13.3968254 102.819723,13.3174603 Z"
								id="HYPE-DNA-Copy-13"
								fill="#000"
							/>
						</svg>
					</div>
				</div>

				<div className="header-center">center</div>

				<div className="header-right">
					<div className="menu">some menu</div>
				</div>
			</header>
		);
	}
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(Header);
