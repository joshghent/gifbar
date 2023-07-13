<?php

$lastTag = shell_exec('git describe --tags');

// Only first time will be error, then start by 1.0.0 and add by 0.1.0
if($lastTag==NULL){
    $tag = '1.0.0';
}else{
    $lastTag = explode('.', trim($lastTag));
    $tag = '1.' . ($lastTag[1]+1) . '.0';
}

// Get last content
$file = file_get_contents('CHANGELOG.md');

// Remove title
$content = explode('✅', $file);
if($lastTag==NULL){
    $content[0] = '## CHANGELOG';
}

// Add new line
$newLine = '### - ' . $tag . ' 🗓 ' . date('Y-m-d');

// Unify
$pos = strpos($content[1], PHP_EOL);
if ($pos !== false) {
$str = str_replace(PHP_EOL, '', $str);
    $content[1] = substr_replace($content[1], '', $pos, strlen(PHP_EOL));
}

$newContent = [
    $content[0] . '✅' . PHP_EOL,
    $newLine,
    $content[1]
];

$content = implode(PHP_EOL, $newContent);

file_put_contents('CHANGELOG.md', $content);

shell_exec('git add CHANGELOG.md');

shell_exec('git tag ' . $tag);

shell_exec('git commit -m "chore(release): ' . $tag. '"');
