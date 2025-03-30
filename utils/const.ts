import hokkaido from '~/assets/prefectures/1_hokkaidou.png';
import aomori from '~/assets/prefectures/2_touhoku1__aomori.png';
import iwate from '~/assets/prefectures/2_touhoku2__iwate.png';
import miyagi from '~/assets/prefectures/2_touhoku3__miyagi.png';
import akita from '~/assets/prefectures/2_touhoku4__akita.png';
import yamagata from '~/assets/prefectures/2_touhoku5__yamagata.png';
import fukushima from '~/assets/prefectures/2_touhoku6__fukushima.png';
import ibaraki from '~/assets/prefectures/3_kantou1__ibaraki.png';
import tochigi from '~/assets/prefectures/3_kantou2__tochigi.png';
import gunma from '~/assets/prefectures/3_kantou3__gunma.png';
import saitama from '~/assets/prefectures/3_kantou4__saitama.png';
import chiba from '~/assets/prefectures/3_kantou5__chiba.png';
import tokyo from '~/assets/prefectures/3_kantou6__tokyo.png';
import kanagawa from '~/assets/prefectures/3_kantou7__kanagawa.png';
import yamanashi from '~/assets/prefectures/4_chuubu1_yamanashi.png';
import nagano from '~/assets/prefectures/4_chuubu2_nagano.png';
import niigata from '~/assets/prefectures/4_chuubu3_niigata.png';
import toyama from '~/assets/prefectures/4_chuubu4_toyama.png';
import ishikawa from '~/assets/prefectures/4_chuubu5_ishikawa.png';
import fukui from '~/assets/prefectures/4_chuubu6_fukui.png';
import shizuoka from '~/assets/prefectures/4_chuubu7_shizuoka.png';
import aichi from '~/assets/prefectures/4_chuubu8_aichi.png';
import gifu from '~/assets/prefectures/4_chuubu9_gifu.png';
import mie from '~/assets/prefectures/5_kinki1_mie.png';
import shiga from '~/assets/prefectures/5_kinki2_shiga.png';
import kyoto from '~/assets/prefectures/5_kinki3_kyouto.png';
import osaka from '~/assets/prefectures/5_kinki4_osaka.png';
import hyogo from '~/assets/prefectures/5_kinki5_hyougo.png';
import nara from '~/assets/prefectures/5_kinki6_nara.png';
import wakayama from '~/assets/prefectures/5_kinki7_wakayama.png';
import tottori from '~/assets/prefectures/6_chuugoku1_tottori.png';
import shimane from '~/assets/prefectures/6_chuugoku2_shimane.png';
import okayama from '~/assets/prefectures/6_chuugoku3_okayama.png';
import hiroshima from '~/assets/prefectures/6_chuugoku4_hiroshima.png';
import yamaguchi from '~/assets/prefectures/6_chuugoku5_yamaguchi.png';
import kagawa from '~/assets/prefectures/7_shikoku1_kagawa.png';
import ehime from '~/assets/prefectures/7_shikoku2_ehime.png';
import tokushima from '~/assets/prefectures/7_shikoku3_tokushima.png';
import kochi from '~/assets/prefectures/7_shikoku4_kouchi.png';
import fukuoka from '~/assets/prefectures/8_kyuusyuu1_fukuoka.png';
import saga from '~/assets/prefectures/8_kyuusyuu2_saga.png';
import nagasaki from '~/assets/prefectures/8_kyuusyuu3_nagasaki.png';
import kumamoto from '~/assets/prefectures/8_kyuusyuu4_kumamoto.png';
import oita from '~/assets/prefectures/8_kyuusyuu5_ooita.png';
import miyazaki from '~/assets/prefectures/8_kyuusyuu6_miyazaki.png';
import kagoshima from '~/assets/prefectures/8_kyuusyuu7_kagoshima.png';
import okinawa from '~/assets/prefectures/9_okinawa.png';

type Prefecture = {
    color: string;
    icon: string;
}

/**
 * 都道府県の情報を格納するマップ
 * @type {Object}
 */
export const prefecturesMap: { [keys: number]: Prefecture } = {
    1: { color: '#8580BC', icon: hokkaido },
    2: { color: '#FFB6C1', icon: aomori },
    3: { color: '#98FB98', icon: iwate },
    4: { color: '#DDA0DD', icon: miyagi },
    5: { color: '#F0E68C', icon: akita },
    6: { color: '#87CEEB', icon: yamagata },
    7: { color: '#FFA07A', icon: fukushima },
    8: { color: '#B8860B', icon: ibaraki },
    9: { color: '#32CD32', icon: tochigi },
    10: { color: '#FF69B4', icon: gunma },
    11: { color: '#4682B4', icon: saitama },
    12: { color: '#CD853F', icon: chiba },
    13: { color: '#BA55D3', icon: tokyo },
    14: { color: '#FF4500', icon: kanagawa },
    15: { color: '#2E8B57', icon: yamanashi },
    16: { color: '#DAA520', icon: nagano },
    17: { color: '#6495ED', icon: niigata },
    18: { color: '#FF1493', icon: toyama },
    19: { color: '#00CED1', icon: ishikawa },
    20: { color: '#FF8C00', icon: fukui },
    21: { color: '#8B008B', icon: shizuoka },
    22: { color: '#556B2F', icon: aichi },
    23: { color: '#FF00FF', icon: gifu },
    24: { color: '#1E90FF', icon: mie },
    25: { color: '#FFD700', icon: shiga },
    26: { color: '#8B4513', icon: kyoto },
    27: { color: '#4169E1', icon: osaka },
    28: { color: '#FA8072', icon: hyogo },
    29: { color: '#9370DB', icon: nara },
    30: { color: '#3CB371', icon: wakayama },
    31: { color: '#F08080', icon: tottori },
    32: { color: '#20B2AA', icon: shimane },
    33: { color: '#7B68EE', icon: okayama },
    34: { color: '#BC8F8F', icon: hiroshima },
    35: { color: '#00FA9A', icon: yamaguchi },
    36: { color: '#DB7093', icon: kagawa },
    37: { color: '#F0FFF0', icon: ehime },
    38: { color: '#48D1CC', icon: tokushima },
    39: { color: '#C71585', icon: kochi },
    40: { color: '#191970', icon: fukuoka },
    41: { color: '#F5DEB3', icon: saga },
    42: { color: '#00FF7F', icon: nagasaki },
    43: { color: '#B0C4DE', icon: kumamoto },
    44: { color: '#FF6347', icon: oita },
    45: { color: '#40E0D0', icon: miyazaki },
    46: { color: '#EE82EE', icon: kagoshima },
    47: { color: '#F5F5DC', icon: okinawa }
};