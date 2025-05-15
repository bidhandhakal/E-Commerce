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
    // Convert price from cents to actual currency value
    const priceInCurrency = price / 100;

    // For Nepali Rupees, use a custom formatter
    if (currency === "NPR") {
        // Use Nepali Rupees format
        return `Rs. ${priceInCurrency.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    // For other currencies, use the Intl formatter
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(priceInCurrency);
} 