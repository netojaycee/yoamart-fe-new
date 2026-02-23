function debounce<T extends (...args: any[]) => void>(
    func: T,
    delay: number
): { debounced: (...args: Parameters<T>) => void; clear: () => void } {
    let timer: ReturnType<typeof setTimeout>;
    
    const debounced = (...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), delay);
    };

    const clear = () => {
        clearTimeout(timer);
    };

    return { debounced, clear };
}

export default debounce;
