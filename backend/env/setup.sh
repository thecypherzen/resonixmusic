#!/usr/bin/env bash
echo -e '[ENV] Setting environment variables:\n'
declare -a env_vars
env_vars=('JAM_CLIENT_ID' 'JAM_CLIENT_SECRET' 'RXBE_PORT')

export JAM_CLIENT_ID='326e6baa'
export JAM_CLIENT_SECRET='df9b6da135e5d0ee4431241f8c5d6a8b'
export RXBE_PORT='5001'

res=$(echo ${env_vars[@]}'\n' | tr ' ' '\n')
echo -e "$res"
echo '[ENV] Done.';
