import Image from 'next/image';
import { motion } from 'framer-motion';
import { Activity, ExternalLink } from 'lucide-react';

import type { CompetitionResultImageSet } from '../_lib/resultImageData';

type CompetitionResultImageViewerProps = {
    resultImageSet: CompetitionResultImageSet;
};

const EmptyResultImageState = () => (
    <div className="rounded-xl border border-dashed border-white/15 bg-slate-950/50 px-6 py-16 text-center">
        <h3 className="text-xl font-bold text-white">試合結果は準備中です</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
            結果が確定した試合から順次掲載します。
        </p>
    </div>
);

export const CompetitionResultImageViewer = ({
    resultImageSet,
}: CompetitionResultImageViewerProps) => (
    <motion.div
        key="results"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
    >
        <div className="mb-6 flex flex-col gap-2">
            <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <Activity className="text-red-500" aria-hidden="true" />
                {resultImageSet.sportName} 試合結果
            </h2>
        </div>

        {resultImageSet.images.length === 0 ? (
            <EmptyResultImageState />
        ) : (
            <div className="grid gap-8">
                {resultImageSet.images.map((image) => (
                    <figure
                        key={image.src}
                        className="overflow-hidden rounded-xl border border-white/10 bg-slate-950"
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={image.width}
                            height={image.height}
                            sizes="(max-width: 896px) 100vw, 768px"
                            loading="lazy"
                            className="h-auto w-full object-contain"
                        />
                        <figcaption className="flex flex-col gap-3 border-t border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-relaxed text-slate-300">
                                {image.caption}
                            </p>
                            <a
                                href={image.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${image.caption}の原寸画像を新しいタブで開く`}
                                className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-red-400 transition-colors hover:text-red-300 focus-visible:rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-500"
                            >
                                原寸画像を開く
                                <ExternalLink size={16} aria-hidden="true" />
                            </a>
                        </figcaption>
                    </figure>
                ))}
            </div>
        )}
    </motion.div>
);
