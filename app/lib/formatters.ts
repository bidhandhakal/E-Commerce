/**
 * Format a price as a currency string
 * @param price - The price to format
 * @param currency - The currency code (default: NPR)
 * @returns Formatted price string
 */
export function formatPrice(
    price: number,
    currency: string = "NPR",
    locale: string = "ne-NP"
): string {
    // For Nepali Rupees, use a custom formatter
    if (currency === "NPR") {
        // Use Nepali Rupees format
        return `Rs. ${price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }

    // For other currencies, use the Intl formatter
    return new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(price);
} 