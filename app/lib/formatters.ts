/**
 * Format a price as a currency string
 * @param price - The price to format in cents
 * @param currency - The currency code (default: NPR)
 * @returns Formatted price string
 */
export function formatPrice(
    price: number,
    currency: string = "NPR",
    locale: string = "ne-NP"
): string {

    const priceInCurrency = price / 100;


    if (currency === "NPR") {

        return `Rs. ${priceInCurrency.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }


    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(priceInCurrency);
} 