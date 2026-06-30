async function run() {
  try {
    const res = await fetch('https://ip-ranges.amazonaws.com/ip-ranges.json');
    const data = await res.json();
    const ipv6_prefixes = data.ipv6_prefixes;

    console.log('Searching for region matching prefix "2406:da12:557" ...');
    const matches = ipv6_prefixes.filter(p => p.ipv6_prefix.startsWith('2406:da12:557') || p.ipv6_prefix.startsWith('2406:da12:550'));
    console.log('Matches:', matches);

    // Let's also search for 2406:da12:5
    const widerMatches = ipv6_prefixes.filter(p => p.ipv6_prefix.startsWith('2406:da12:5'));
    console.log('Wider Matches:', widerMatches.slice(0, 10));

    // Let's search for 2406:da12:
    const generalMatches = ipv6_prefixes.filter(p => p.ipv6_prefix.startsWith('2406:da12'));
    console.log('General Matches count:', generalMatches.length);
    console.log('General Matches unique regions:', [...new Set(generalMatches.map(m => m.region))]);
  } catch (err) {
    console.error('Error:', err);
  }
}
run();
