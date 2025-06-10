import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as dayjs from 'dayjs';
import * as qs from 'qs';

@Injectable()
export class VnpayService {
  private readonly tmnCode = process.env.VNP_TMNCODE;
  private readonly secretKey = process.env.VNP_HASH_SECRET;
  private readonly vnpUrl = process.env.VNP_URL;
  private readonly returnUrl = process.env.VNP_RETURN_URL;

  // TODO: update when vnpay no error
  createPaymentUrl(clientIp: string, amount: number, orderId: string): string {
    const createDate = dayjs().format('YYYYMMDDHHmmss');
    const orderInfo = `Thanh toan don hang ${orderId}`;
    const orderType = 'other';

    const vnp_Params: Record<string, string | number> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: this.tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: orderType,
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: this.returnUrl,
      vnp_IpAddr: clientIp,
      vnp_CreateDate: createDate,
    };

    const sortedParams = Object.fromEntries(
      Object.entries(vnp_Params).sort(([a], [b]) => a.localeCompare(b)),
    );

    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', this.secretKey);
    const secureHash = hmac
      .update(Buffer.from(signData, 'utf-8'))
      .digest('hex');

    sortedParams['vnp_SecureHash'] = secureHash;

    const paymentUrl = `${this.vnpUrl}?${qs.stringify(sortedParams, { encode: false })}`;
    return paymentUrl;
  }
}
