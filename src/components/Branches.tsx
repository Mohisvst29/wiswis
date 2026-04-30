"use client";
import React, { useEffect, useState } from 'react';
import { useLang } from '@/components/LangProvider';
import dynamic from 'next/dynamic';

const MapWrapper = dynamic(() => import('@/components/MapWrapper'), { ssr: false, loading: () => <div className="w-full h-full bg-[#111] animate-pulse rounded-2xl flex items-center justify-center text-gray-500">جاري تحميل الخريطة...</div> });

export default function Branches() {
  const { t, lang } = useLang();
  const [branches, setBranches] = useState<any[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [activeRegion, setActiveRegion] = useState<string>('all');
  const [activeBranchId, setActiveBranchId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/branches').then(r => r.json()).then(data => {
      if (data && data.length > 0) {
        const activeBranches = data.filter((b: any) => b.isActive);
        setBranches(activeBranches);
        
        // Extract unique regions (cityAr / cityEn)
        const uniqueRegions = Array.from(new Set(activeBranches.map((b: any) => lang === 'ar' ? b.cityAr : b.cityEn))) as string[];
        setRegions(uniqueRegions);
        if (activeBranches.length > 0) setActiveBranchId(activeBranches[0]._id);
      }
    }).catch(() => {});
  }, [lang]);

  const filteredBranches = activeRegion === 'all' 
    ? branches 
    : branches.filter(b => (lang === 'ar' ? b.cityAr : b.cityEn) === activeRegion);

  return (
    <section className="branches" id="branches">
      <div className="section-header reveal-scroll">
        <h4 className="section-subtitle">{t('branches_sub')}</h4>
        <h2 className="section-title">{t('branches_title')}</h2>
      </div>
      
      {/* Regions Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10 px-4">
        <button 
          onClick={() => setActiveRegion('all')}
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeRegion === 'all' ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30' : 'bg-transparent border-white/20 text-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
        >
          {lang === 'ar' ? 'جميع المناطق' : 'All Regions'}
        </button>
        {regions.map((region, i) => (
          <button 
            key={i}
            onClick={() => setActiveRegion(region)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all border ${activeRegion === region ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/30' : 'bg-transparent border-white/20 text-gray-300 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}
          >
            {region}
          </button>
        ))}
      </div>

      <div className="branches-container reveal-scroll">
        <div className="branches-sidebar">
          <div className="branches-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '10px' }}>
            {filteredBranches.length > 0 ? (
              filteredBranches.map((b, i) => (
                <div 
                  key={b._id} 
                  onClick={() => setActiveBranchId(b._id)}
                  className={`branch-card cursor-pointer transition-all ${activeBranchId === b._id ? 'active !border-[var(--color-primary)]' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <h4>{lang === 'ar' ? b.nameAr : b.nameEn}</h4>
                    {b.mapUrl && (
                      <a href={b.mapUrl} target="_blank" className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--color-primary)] transition-colors" onClick={(e) => e.stopPropagation()}>
                        {lang === 'ar' ? 'افتح في جوجل ماب' : 'Open in Maps'}
                      </a>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-400">{lang === 'ar' ? b.descAr : b.descEn}</p>
                </div>
              ))
            ) : (
              <div className="branch-card active">
                <h4>{lang === 'ar' ? 'لا توجد محطات في هذه المنطقة' : 'No stations in this region'}</h4>
              </div>
            )}
          </div>
        </div>
        <div className="branches-map" style={{ height: '600px' }}>
          <MapWrapper branches={filteredBranches} activeBranchId={activeBranchId} />
        </div>
      </div>
    </section>
  );
}
