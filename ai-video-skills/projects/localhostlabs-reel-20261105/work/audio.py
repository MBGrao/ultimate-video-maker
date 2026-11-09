from mixlib import Mix
m = Mix(); s, put, wt, SC, LN = m.s, m.put, m.wt, m.SC, m.LN
# HOOK
put(m.sub(), 0.02, -9); put(s('impact/impactSoft_heavy_000.ogg'), 0.04, -10)
for i in range(3): put(s(f'interface/drop_00{i+1}.ogg'), wt('hook1', 'banda') + i * 0.12 + 0.03, -14, [-.3, 0, .3][i])
put(s('ui/rollover2.ogg'), wt('hook1', 'soch') + 0.03, -12, 0.3)
put(s('impact/impactPunch_heavy_001.ogg'), wt('hook1', 'ruko') + 0.03, -8); put(m.sub(0.7, 60), wt('hook1', 'ruko') + 0.03, -11)
put(m.whoosh(0.35, 900, 3500, 0.7), wt('hook2', 'nahi') - 0.1, -17)
put(s('interface/bong_001.ogg'), wt('hook2', 'system'), -15)
for i in range(4): put(s(f'casino/card-place-{i+1}.ogg'), wt('hook2', 'chahiye') + 0.02 + i * 0.07, -17, [-.3, -.1, .1, .3][i])
# wipes
for sid in ['story', 'trans', 'p2', 'p3', 'punch', 'save']:
    m.whoosh_at(SC[sid]['start'] + 0.05, -10); put(s('impact/impactSoft_heavy_001.ogg'), SC[sid]['start'], -12)
# soft cuts
for sid in ['p1', 'follow']: put(m.whoosh(0.4, 600, 2600, 0.5), SC[sid]['start'] - 0.25, -16)
# STORY card pops
for k, w, n in [('s1', 'orders', 1), ('s1', 'stock', 2), ('s2', 'whatsapp', 3), ('s2', 'invoice', 4), ('s2', 'inbox', 5), ('s3', 'har', 6)]:
    put(s(f'casino/card-slide-{n}.ogg'), wt(k, w) + 0.02, -13, [-.3, .3][n % 2])
put(s('casino/card-slide-7.ogg'), wt('s3', 'data') - 0.23, -13, 0.3)
put(s('ui/click3.ogg'), wt('s2', 'whatsapp') + 0.1, -16)
for r in [wt('s3', 'idhar') - 0.15, wt('s3', 'udhar') + 0.15]:
    put(s('keyboard/keypress-004.wav'), r + 0.02, -15); put(s('keyboard/keypress-009.wav'), r + 0.36, -15)
    put(m.whoosh(0.4, 700, 2200, 0.5), r + 0.05, -22)
# TRANS
put(s('impact/impactWood_medium_002.ogg'), wt('tr', 'khaate') + 0.03, -11)
put(s('interface/drop_002.ogg'), wt('tr', 'munshi') + 0.03, -11)
put(s('ui/rollover4.ogg'), wt('tr', 'samajhte') + 0.03, -16)
# P1
put(s('interface/switch_004.ogg'), SC['p1']['start'] + 0.05, -13)
for i in range(4): put(m.whoosh(0.3, 2400, 600, 0.6), SC['p1']['start'] + 0.1 + i * 0.06, -23)
for w in ['orders', 'stock', 'invoice']: put(s('interface/click_003.ogg'), wt('p1', w) + 0.02, -12)
for w, n in [('sab', 0), ('ek', 1), ('jagah', 0)]: put(s('interface/select_008.ogg'), wt('p1', w, n) + 0.03, -17)
# P2
put(s('interface/switch_004.ogg'), SC['p2']['start'] + 0.05, -13)
put(s('interface/drop_003.ogg'), wt('p2a', 'munshi') + 0.03, -12)
put(s('ui/rollover5.ogg'), wt('p2a', 'kabhi') + 0.03, -17)
put(s('interface/error_005.ogg'), wt('p2a', 'sota') + 0.2, -19)
put(m.whoosh(0.45, 400, 2400, 0.6), LN['p2b']['start'] - 0.3, -15)
a0, a1 = wt('p2b', 'bees') - 0.1, wt('p2b', 'hua')
for i in range(7): put(m.tick(2600 - i * 120), a0 + (a1 - a0) * (1 - (1 - (i + 0.5) / 7) ** 3), -20)
put(s('interface/glitch_002.ogg'), a1 - 0.05, -20)
put(s('interface/bong_001.ogg'), wt('p2b', 'whatsapp') + 0.05, -12); put(s('ui/switch12.ogg'), wt('p2b', 'whatsapp'), -15)
k0 = wt('p2b', 'khud') - 0.05
for i in range(8): put(s(f'keyboard/keypress-0{10+i}.wav'), k0 + i * 0.06, -21, 0.2)
put(s('interface/click_005.ogg'), wt('p2b', 'khud') + 0.55, -13)
# P3
put(s('interface/switch_004.ogg'), SC['p3']['start'] + 0.05, -13)
put(s('casino/card-slide-3.ogg'), wt('p3', 'sales') - 0.05, -13); put(s('interface/bong_001.ogg'), wt('p3', 'sales') + 0.15, -17)
for i in range(7): put(s('ui/rollover2.ogg'), wt('p3', 'email') + i * 0.05, -24, -0.4 + i * 0.13)
k0 = wt('p3', 'owner') - 0.05
for i in range(8): put(s(f'keyboard/keypress-0{20+i}.wav'), k0 + i * 0.06, -21, 0.2)
put(s('interface/click_005.ogg'), wt('p3', 'owner') + 0.6, -13)
# PUNCH
put(s('casino/card-shove-1.ogg'), wt('pu1', 'excel') - 0.08, -12)
put(s('ui/rollover1.ogg'), wt('pu1', 'bolna'), -16)
put(m.whoosh(0.4, 500, 2600, 0.6), LN['pu2']['start'] - 0.28, -14)
put(s('impact/impactWood_heavy_001.ogg'), wt('pu2', 'khaata') + 0.03, -12)
put(s('impact/impactPunch_heavy_003.ogg'), wt('pu2', 'munshi') - 0.03, -7); put(m.sub(0.9, 50), wt('pu2', 'munshi') - 0.03, -10)
# SAVE
put(s('ui/click2.ogg'), wt('c1', 'save') + 0.1, -11); put(s('interface/select_008.ogg'), wt('c1', 'save') + 0.18, -15)
put(s('ui/click2.ogg'), wt('c1', 'bhejo'), -11); put(s('casino/card-slide-4.ogg'), wt('c1', 'bhejo') + 0.05, -15)
put(s('ui/click4.ogg'), wt('c1', 'sheets'), -12)
put(s('casino/card-place-2.ogg'), wt('c1', 'dost') + 0.02, -15)
# FOLLOW + end card
put(s('ui/click2.ogg'), wt('c2', 'follow') + 0.15, -10); put(s('interface/select_008.ogg'), wt('c2', 'follow') + 0.22, -14)
put(s('ui/click2.ogg'), wt('c2', 'dm'), -11)
e = LN['c2']['end'] + 0.3
put(m.whoosh(0.5, 400, 2600, 0.6), e - 0.25, -14); put(s('impact/impactSoft_heavy_003.ogg'), e + 0.05, -9); put(m.sub(1.2, 46), e + 0.05, -10)
put(s('interface/bong_001.ogg'), e + 0.15, -12)
m.render('happy-beats-business-moves-vol-9-by-ende-dot-app.mp3')
