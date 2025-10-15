import LogoImage from '../assets/SvasthyaLogo.png';

type LogoProps = {
    size?: number | string;
    className?: string;
    alt?: string;
};

const toCssSize = (size: number | string): string => {
    return typeof size === 'number' ? `${size}px` : size;
};

export default function Logo({ size = 48, className, alt = 'Svasthya logo' }: LogoProps) {
    const dimension = toCssSize(size);
    return (
        <img
            src={LogoImage}
            alt={alt}
            width={typeof size === 'number' ? size : undefined}
            height={typeof size === 'number' ? size : undefined}
            style={{ width: dimension, height: dimension, objectFit: 'contain' }}
            className={className}
        />
    );
}


