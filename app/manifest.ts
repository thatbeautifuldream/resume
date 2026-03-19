import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Milind Mishra – Resume",
		short_name: "Milind Resume",
		description: "Product Engineer based in India – Interactive Resume",
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		background_color: "#ffffff",
		theme_color: "#ffffff",
		icons: [
			{
				src: "/icons/Icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icons/Icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
			{
				src: "/icons/Icon-512.png",
				sizes: "512x512",
				type: "image/png",
				purpose: "maskable",
			},
		],
	};
}
